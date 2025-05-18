const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 50000, // Increase timeout to 50 seconds
    connectTimeoutMS: 50000, // Connect timeout to 50 seconds
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
