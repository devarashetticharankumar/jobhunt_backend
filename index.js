const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Increase the request body size limit
app.use(express.json({ limit: "10mb" })); // Adjust the size as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cors({ origin: "https://jobnirvana.netlify.app" }));
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
const contactUs = require("./routes/ContactUs");
const blogRoutes = require("./routes/blogRoutes"); // Add this line

app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/api", contactUs);
app.use("/blogs", blogRoutes); // Add this line

const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKSURI,
  }),
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ["RS256"],
});

app.use(checkJwt);

app.get("/", (req, res) => {
  res.send("Hello World!!!!!!!!!!!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

connectDB().then((db) => {
  app.locals.db = db;
});
