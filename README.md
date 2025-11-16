
---

# Moravian Scheduler

Moravian Scheduler is a fast and modern web app designed to make browsing Moravian University course offerings easier and more efficient. It provides a cleaner interface, quicker searching, and a better overall experience compared to AMOS.

## 🚀 Features

* **Fast course lookup** with instant filtering
* **Modern, responsive UI** built with React
* **Smooth animations** using Framer Motion
* **Filter by department, instructor, days, LINC, title, and more**
* Optional backend integration for dynamic course data

## 🛠️ Tech Stack

**Frontend**

* React
* Framer Motion
* CSS

**Backend**

* Spring Boot
* PostgreSQL
* CSV → Database pipeline
* REST API returning JSON

## 📡 API Endpoints

These endpoints return JSON course data from the backend:

| Endpoint            | Description                            |
| ------------------- | -------------------------------------- |
| **GET /all**        | Returns all courses                    |
| **GET /courses**    | Fetches courses with general filtering |
| **GET /instructor** | Filters courses by instructor          |
| **GET /linc**       | Filters courses by LINC requirement    |
| **GET /days**       | Filters by meeting days                |
| **GET /title**      | Filters by title or keywords           |

*(If needed, I can format these as cURL examples too.)*

## 📦 Running the Project

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm start
```

Runs on **[http://localhost:3000](http://localhost:3000)**.

### Build for production

```bash
npm run build
```

## 🌐 Live Version

**moravian-scheduler.com**

