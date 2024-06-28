const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

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
});

// Database connection
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("job-portal-db");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Routes
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
app.use("/subscriptions", subscriptionRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!!!!!!!!!!!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

connectDB().then((db) => {
  app.locals.db = db;
});
