import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../auth/firebase";
import { db } from "../../../auth/firebase";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

import "./courses.css";

const Courses = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("all");
    const [query, setQuery] = useState("");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);


    const BASE_URL = "http://localhost:8080/api/v1/moraviancourses";


    const createGoogleCalendarLink = (course) => {
        if (!course.startDate || !course.endTime || !course.startTime) return "#";

        const title = `${course.courseCode} - ${course.title}`;

        // Google Calendar expects datetime as YYYYMMDDTHHMMSSZ
        const formatDateTime = (date, time) => {
            const dt = new Date(`${date}T${time}`);
            return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        };

        const startDateTime = formatDateTime(course.startDate, course.startTime);
        const endDateTime = formatDateTime(course.startDate, course.endTime);

        // Recurrence rule (weekly repeat until endDate)
        const daysMap = {
            M: "MO",
            T: "TU",
            W: "WE",
            R: "TH",
            F: "FR",
            S: "SA",
            U: "SU",
        };

        let byDay = "";
        if (course.days) {
            byDay = course.days
                .split("")
                .map((d) => daysMap[d] || "")
                .filter(Boolean)
                .join(",");
        }

        const rrule = byDay
            ? `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${course.endDate.replace(/-/g, "")}T235959Z`
            : "";

        const details = encodeURIComponent(
            `Instructor: ${course.instructor}\nCredits: ${course.unitsCredits}`
        );

        const url = new URL("https://calendar.google.com/calendar/render");
        url.searchParams.set("action", "TEMPLATE");
        url.searchParams.set("text", title);
        url.searchParams.set("dates", `${startDateTime}/${endDateTime}`);
        url.searchParams.set("details", details);
        if (rrule) url.searchParams.set("recur", rrule);

        return url.toString();
    };


    const saveCourseForUser = async (course) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
        savedCourses: arrayUnion({
            id: course.id,
            title: course.title,
            courseCode: course.courseCode,
            instructor: course.instructor,
        })
    }).catch(async () => {
        // If doc doesn’t exist yet, create it
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            savedCourses: [{
                id: course.id,
                title: course.title,
                courseCode: course.courseCode,
                instructor: course.instructor,
            }]
        });
    });
};



    const getSubtermText = (subterm) => {
        switch (subterm) {
            case "70": return "Full Semester";
            case "71": return "First Half Semester";
            case "72": return "Second Half Semester";
            default: return "Unknown";
        }
    };

    const courseTypeTooltip = {
        CL: "Classroom / Lecture-based",
        OS: "Online Synchronous (live online)",
        OL: "Online Asynchronous (self-paced)",
        HY: "Hybrid (mix of in-person + online)",
        LB: "Lab course",
        IN: "Internship",
        HN: "Honors course",
        TR: "Travel / Special term course",
        WI: "Writing Intensive",
        "N/A": "Not applicable / Not categorized",
    };

    const fetchCourses = async () => {
        setLoading(true);
        let url = `${BASE_URL}/all`;
        if (searchType !== "all" && query.trim() !== "") {
            url = `${BASE_URL}/${searchType}/${query}`;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setCourses([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);


    const formatTime = (time) => {
        if (!time) return "TBA";
        const [hour, min] = time.split(":");
        const h = hour % 12 || 12;
        const ampm = hour < 12 ? "AM" : "PM";
        return `${h}:${min} ${ampm}`;
    };

    return (
        <div className="courses-dashboard">
            <button className="home-button" onClick={() => navigate("/")}>
                ← Home
            </button>
            <button className="user-page-button" onClick={() => navigate("/users")}>
    👥 Users Page
</button>


            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Moravian Courses Dashboard
            </motion.h1>

            <div className="search-container">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="all">All Courses</option>
                    <option value="code">Course Code</option>
                    <option value="instructor">Instructor</option>
                    <option value="days">Days</option>
                    <option value="title">Title</option>
                </select>

                {searchType !== "all" && (
                    <input
                        type="text"
                        placeholder={`Search by ${searchType}`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                )}

                <button onClick={fetchCourses}>Search</button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : courses.length === 0 ? (
                <p>No courses found</p>
            ) : (
                <div className="courses-cards">
                    {courses.map((course) => (
                        <motion.div
                            key={course.id}
                            className="course-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2>
                                {course.courseCode}: {course.title}
                            </h2>
                            <p><strong>Instructor:</strong> {course.instructor || "TBA"}</p>
                            <p><strong>Days:</strong> {course.days || "TBA"}</p>
                            <p>
                                <strong>Time:</strong>{" "}
                                {course.startTime && course.endTime
                                    ? `${formatTime(course.startTime)} - ${formatTime(course.endTime)}`
                                    : "TBA"}
                            </p>
                            <p><strong>LINC:</strong> {course.linc || "TBA"}</p>
                            <p><strong>Credits:</strong> {course.unitsCredits || "N/A"}</p>
                            <p><strong>Max Enrollment:</strong> {course.maxEnr || "N/A"}</p>
                            <p><strong>Subterm:</strong> {getSubtermText(course.subterm)}</p>
                            <p>
                                <strong>Course Type:</strong>{" "}
                                <span className="tooltip">
                                    {course.courseType || "N/A"}
                                    <span className="tooltiptext">
                                        {courseTypeTooltip[course.courseType] || "Unknown"}
                                    </span>
                                </span>
                            </p>
                            <p>
                                <strong>Term:</strong>{" "}
                                {course.startDate && course.endDate
                                    ? `${new Date(course.startDate).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })} - ${new Date(course.endDate).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}`
                                    : "TBA"}
                            </p>
<a
  href={createGoogleCalendarLink(course)}
  target="_blank"
  rel="noopener noreferrer"
  className="add-calendar-btn"
  onClick={() => saveCourseForUser(course)}
>
  ➕ Add to Google Calendar
</a>

                        </motion.div>
                    ))}
                </div>
            )}
            <div className="user-info">
    {user && (
        <>
            <p>Signed in as: <strong>{user.displayName}</strong></p>
            <button
                className="sign-out-button"
                onClick={async () => {
                    try {
                        await auth.signOut();
                        setUser(null);
                        navigate("/login"); // Redirect to login after sign out
                    } catch (err) {
                        console.error("Sign out error:", err);
                    }
                }}
            >
                🔒 Sign Out
            </button>
        </>
    )}
</div>


        </div>
    );
};

export default Courses;
