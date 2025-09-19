require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/errorController/errorController");

// 2. HELMET SETUP
// ==========================================
app.use(helmet()); // Let crossOriginEmbedderPolicy default to true

const isProduction = process.env.NODE_ENV === "production";

// Enable HSTS (HTTPS enforcement) only on production
if (isProduction) {
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    })
  );
}

// Custom Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://gracerouteltd.com", // allow frontend JS if needed
        "https://cdn.jsdelivr.net", // allow common CDNs if needed
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "'unsafe-inline'", // Remove if you're not using inline styles
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "https://gracerouteltd.com", // if frontend makes fetch() to backend
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [], // auto upgrade http to https
    },
  })
);

// X-Frame-Options: sameorigin (prevents clickjacking)
app.use(helmet.frameguard({ action: "sameorigin" }));

// X-Content-Type-Options: nosniff
app.use(helmet.noSniff());

// X-Download-Options for IE
app.use(helmet.ieNoOpen());

// Referrer-Policy
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

// X-Permitted-Cross-Domain-Policies
app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: "none" }));

// Hide X-Powered-By (though Express does this too)
app.use(helmet.hidePoweredBy());

if (isProduction) {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

const port = process.env.PORT || 3300;

const frontendURL = isProduction
  ? "https://gracerouteltd.com"
  : "http://localhost:5173";

app.use(
  cors({
    origin: frontendURL,
    credentials: true, // must match with Axios `withCredentials: true`
  })
);

const userRoutes = require("./routes/user_routes");
const adminRoutes = require("./routes/admin_routes");

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "server up and running", data: isProduction });
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Catch all unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// 🔹 Global error handler
app.use(globalErrorHandler);

app.listen(port, () => console.log(`Server running on PORT: ${port}`));
