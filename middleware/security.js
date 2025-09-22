const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const hpp = require("hpp");
const sanitizeHtml = require("sanitize-html");
const { validationResult } = require("express-validator");
const { doubleCsrf } = require("csrf-csrf");
const AppError = require("../utils/AppError");

/* ---------------------------
   1. Rate Limiters
--------------------------- */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // 5 requests/IP
  message: "Too many login attempts. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests/IP
  message: "Too many requests. Please slow down.",
  standardHeaders: true,
  legacyHeaders: false,
});

/* ---------------------------
   2. CORS Setup
--------------------------- */
const corsOptions = {
  origin: ["http://localhost:5173", "https://gracerouteltd.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // allow cookies
};

/* ---------------------------
   3. CSRF Protection (csrf-csrf)
--------------------------- */
const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "default_csrf_secret",
  cookieName: "__Host-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  },
  size: 64,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // don’t protect safe methods
});

const csrfMiddleware = doubleCsrfProtection;

/* ---------------------------
   4. Sanitization
--------------------------- */
function sanitizeInput(input) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

function sanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    }
  }
  next();
}

/* ---------------------------
   5. Express-validator error handler
--------------------------- */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }
  next();
}

/* ---------------------------
   6. Apply All Security Middleware
--------------------------- */
function applySecurity(app) {
  app.use(helmet());
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    app.use(
      helmet.hsts({
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      })
    );
  }

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://yourfrontenddomain.com",
          "https://cdn.jsdelivr.net",
        ],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "'unsafe-inline'", // remove if no inline styles
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://yourfrontenddomain.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );

  app.use(helmet.frameguard({ action: "sameorigin" }));
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
  app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: "none" }));
  app.use(helmet.hidePoweredBy());

  app.use(cors(corsOptions));
  app.use(hpp());
  app.use(sanitizeMiddleware);

  app.use("/api", apiRateLimiter);
}

/* ---------------------------
   Exports
--------------------------- */
module.exports = {
  authRateLimiter,
  apiRateLimiter,
  corsOptions,
  csrfMiddleware,
  sanitizeMiddleware,
  validateRequest,
  applySecurity,
};
