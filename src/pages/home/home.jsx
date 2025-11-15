import React from "react";
import "./home.css";
import { motion } from "framer-motion";
import { CalendarDays, FileSpreadsheet, Search, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const iconVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const Home = () => {
  const navigate = useNavigate();



  return (
    <div className="home">
      <header className="header">
        <h1 className="logo">Moravian Scheduler</h1>
        <button onClick={()=> {
          navigate('/courses')
        }} className="view-btn">VIEW CLASSES</button>
      </header>

      <main className="main">
        {/* LEFT SIDE */}
        <motion.div
          className="left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="welcome">Welcome To</h2>
          <h1 className="title">Moravian Scheduler</h1>
          <p className="desc">
            The simplest way to organize your class schedule.<br />
            Add your classes, plan your week, and export your schedule directly
            to Google Docs — all in one place.
          </p>

          <motion.button
            className="get-started"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={()=> {
          navigate('/courses')
        }}
          >
            GET STARTED <ArrowRight className="icon-right" />
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          className="right"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="icon-grid"
            initial="initial"
            animate="animate"
          >
            {[
              { icon: <Search size={36} />, text: "Search Classes" },
              { icon: <CalendarDays size={36} />, text: "Plan Schedule" },
              { icon: <Clock size={36} />, text: "Stay Organized" },
              { icon: <FileSpreadsheet size={36} />, text: "Export to Docs" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="icon-card"
                variants={iconVariants}
                custom={i}
                whileHover={{ scale: 1.1, rotate: 3 }}
              >
                {item.icon}
                <p>{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      <footer className="footer">
        <p>© 2025 Moravian Scheduler. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
