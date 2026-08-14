import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import authRouter from "./routes/auth.js";
import contentRouter from "./routes/content.js";
import servicesRouter from "./routes/services.js";
import projectsRouter from "./routes/projects.js";
import teamRouter from "./routes/team.js";
import testimonialsRouter from "./routes/testimonials.js";
import careersRouter from "./routes/careers.js";
import inquiriesRouter from "./routes/inquiries.js";
import mediaRouter from "./routes/media.js";

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow Vite dev server and production origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

// Ensure public upload directories exist
const uploadDirs = [
  "public/uploads/media",
  "public/uploads/resumes"
];
for (const dir of uploadDirs) {
  const resolvedPath = path.resolve(dir);
  if (!fs.existsSync(resolvedPath)) {
    fs.mkdirSync(resolvedPath, { recursive: true });
    console.log(`Created uploads directory: ${resolvedPath}`);
  }
}

// Serve uploaded files statically
app.use("/uploads", express.static(path.resolve("public/uploads")));

// Root route for status check
app.get("/", (req, res) => {
  res.send("<h1>Cre8tiveCove API Server is running</h1><p>Visit <code>/api/services</code> or other endpoints to check data.</p>");
});

app.get("/api", (req, res) => {
  res.json({ status: "running", message: "Welcome to Cre8tiveCove API" });
});

// Register routers
app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/services", servicesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/team", teamRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api", careersRouter); // includes /jobs, /postings, /applications
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/media", mediaRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled server error:", err);
  return res.status(500).json({ error: err.message || "Internal server error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  Cre8tiveCove API Server running on port ${PORT}`);
  console.log(`===============================================`);
});
