const express = require("express");
require("dotenv").config();
const cors = require('cors');
const app = express()
app.use(cors(
  {
    origin: ["https://quiz-app-frontend-drab.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
  }
));

app.use(express.json());


// Database config
const dbConfig = require("./config/dbConfig");

// Routes
const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");

app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);

const port = process.env.PORT || 5000;

const path = require("path");

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
