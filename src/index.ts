import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import helmet from "helmet";

interface CorsOptions {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => void;
  methods: string;
  allowedHeaders: string[];
}

// cors setup
var whitelist = ["http://example1.com", "http://example2.com"];
var corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin || "") !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "token"],
};

// Rate limiter setup
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests form this IP, try again after one hour!",
});

const app = express();

// Middlewares
app.use(helmet());
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(cors(corsOptions));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
