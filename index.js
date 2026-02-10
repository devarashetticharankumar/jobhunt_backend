const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

// Increase the request body size limit
app.use(express.json({ limit: "10mb" })); // Adjust the size as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: ["https://jobnirvana.netlify.app", "http://localhost:5173"],
  })
);
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Check environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  socketTimeoutMS: 60000, // 60s
  connectTimeoutMS: 60000, // 60s
  maxPoolSize: 50
});

// Database connection
let db;
const setupJobAlerts = require("./cron/jobAlerts");

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("job-portal-db");
    app.locals.db = db;
    global.db = db;

    // Initialize Cron Jobs
    setupJobAlerts(db);

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // process.exit(1); // Do not exit, allow server to start for 503 responses
  }
}

// Middleware to check DB connection
app.use((req, res, next) => {
  if (!app.locals.db) {
    return res.status(503).json({ message: "Service Unavailable: Database not connected yet" });
  }
  next();
});

// Routes
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const contactUs = require("./routes/ContactUs");
const blogRoutes = require("./routes/blogRoutes");
const sitemapRouter = require("./routes/sitemap");
const resume = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/api", contactUs);
app.use("/blogs", blogRoutes);
app.use("/", sitemapRouter);
app.use("/resumes", resume);
app.use("/ai", aiRoutes);
app.use("/applications", applicationRoutes);
app.use("/reviews", reviewRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploaded resumes

// Auth0 middleware moved to middleware/auth.js

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.get("/", (req, res) => {
  res.send("Hello World!!!!!!!!!!!");
});

app.get("/", (req, res) => {
  res.send("Hello World!!!!!!!!!!!");
});

// Start server immediately/after attempt, don't wait for success
connectDB().finally(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
