const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const httpStatus = require("http-status");
const { GlobalHandler } = require("./modules/hooks/golobal_error");
const routes = require("./routers/router");
const routes_v2 = require("./routers/v2Routes");
const path = require("path");
const mysql = require("mysql2");


const app = express();
const port = process.env.PORT || 5005;

// app.use(cors({
//       origin: 'http://localhost:5173',
//       credentials: true,
// }));


const allowedOrigins = [
      'https://kalbela-jobs-backend.vercel.app',
      'https://app.kalbelajobs.com',
      'https://www.app.kalbelajobs.com',
      'https://kalbelajobs.com',
      'https://www.kalbelajobs.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://192.168.0.101:3000',
];

// const corsOptions = {
//       origin: (origin, callback) => {
//             // Allow requests with no origin (like mobile apps or curl requests)
//             if (!origin || allowedOrigins.includes(origin)) {
//                   callback(null, true);
//             } else {
//                   callback(new Error('Not allowed by CORS'));
//             }
//       },
//       credentials: true,
//       methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
// };

const corsOptions = {
      origin: '*', // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true, // Optional: Allow cookies and credentials
};






// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
});
// Routes
app.use('/api/v1', routes);
app.use('/api/v2', routes_v2);


app.use(GlobalHandler);

// 404 Error handler
app.use((req, res, next) => {
      res.status(httpStatus.NOT_FOUND).json({
            error: true,
            message: 'Not Found',
            path: req.originalUrl,
            request_id: new Date().getTime(),
            status_code: 404
      });
});

// Start server
app.listen(port, () => {

      console.log(`Server is running at http://localhost:${port}`);
});
