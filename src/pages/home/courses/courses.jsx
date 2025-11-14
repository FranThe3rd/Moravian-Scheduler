import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./courses.css";

const Courses = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("all");
    const [query, setQuery] = useState("");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const BASE_URL = "http://localhost:8080/api/v1/moraviancourses";

    const getSubtermText = (subterm) => {
        switch (subterm) {
            case "70": return "Full Semester";
            case "71": return "First Half Semester";
            case "72": return "Second Half Semester";
            default: return "Unknown";
        }
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

            <h1>Moravian Courses Dashboard</h1>

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
                            <p><strong>Course Type:</strong> {course.courseType || "N/A"}</p>
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
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Courses;
