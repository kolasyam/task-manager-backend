const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./config/db");
const PORT = process.env.PORT || 8000;
app.get("/ping", (req, res) => {
  res.send("PONGI");
});
app.use(bodyParser.json());
app.use(cors());
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/task", require("./routes/taskRoutes"));
// app.use("/api/tasks", require("./routes/taskRoutes"));
// After all your routes
app.use((err, req, res, next) => {
  console.error(err.stack); // this will print the error in Render logs
  res.status(500).json({ message: err.message }); // show actual error to frontend/postman
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
