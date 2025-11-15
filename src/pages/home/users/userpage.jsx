import React, { useState, useEffect } from "react";
import { auth, db } from "../../../auth/firebase";
import { collection, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore";
import "./userpage.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users from Firestore...");
      try {
        const usersCol = collection(db, "users");
        const usersSnapshot = await getDocs(usersCol);

        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Users list:", usersList);

        // Sort: current user on top
        const sortedUsers = [...usersList];
        if (currentUser) {
          sortedUsers.sort((a, b) => (a.id === currentUser.uid ? -1 : b.id === currentUser.uid ? 1 : 0));
        }

        setUsers(sortedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
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
      // Update local state
      setUsers(prev =>
        prev.map(u =>
          u.id === currentUser.uid
            ? { ...u, savedCourses: u.savedCourses.filter(c => c.id !== course.id) }
            : u
        )
      );
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="users-dashboard">
      <h1>All Users & Their Classes</h1>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="users-list">
          {users.map(user => (
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
                          ❌ Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved classes</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
