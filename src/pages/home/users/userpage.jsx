import React, { useState, useEffect } from "react";
import { auth, db } from "../../../auth/firebase";
import { collection, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./userpage.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterSameClass, setFilterSameClass] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, "users");
        const usersSnapshot = await getDocs(usersCol);

        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort current user on top
        if (currentUser) {
          usersList.sort((a, b) => (a.id === currentUser.uid ? -1 : b.id === currentUser.uid ? 1 : 0));
        }

        setUsers(usersList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const deleteCourse = async (course) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    try {
      await updateDoc(userRef, {
        savedCourses: arrayRemove(course)
      });
      setUsers(prev =>
        prev.map(u =>
          u.id === currentUser.uid
            ? { ...u, savedCourses: (u.savedCourses || []).filter(c => c.id !== course.id) }
            : u
        )
      );
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  // Find Firestore current user object
  const currentUserData = users.find(u => u.id === currentUser?.uid);

  // Filter users with at least one shared course with current user
  const filteredUsers = filterSameClass && currentUserData
    ? users.filter(u =>
        (u.savedCourses || []).some(course =>
          (currentUserData.savedCourses || []).some(myCourse => myCourse.id === course.id)
        )
      )
    : users;

  return (
    <div className="users-dashboard">
      <button className="back-btn" onClick={() => navigate("/courses")}>← Back to Courses</button>
      <button className="filter-btn" onClick={() => setFilterSameClass(!filterSameClass)}>
        {filterSameClass ? "Show All Users" : "Show Users With Same Classes"}
      </button>

      <h1>All Users & Their Classes</h1>
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="users-list">
          {filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <h3>Saved Classes:</h3>
              {Array.isArray(user.savedCourses) && user.savedCourses.length > 0 ? (
                <ul>
                  {user.savedCourses.map(course => (
                    <li key={course.id}>
                      {course.courseCode} - {course.title} ({course.instructor || "TBA"})
                      {currentUser && user.id === currentUser.uid && (
                        <button
                          className="delete-course-btn"
                          onClick={() => deleteCourse(course)}
                        >
                        Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved classes, possibly got opps to keep their info private...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
