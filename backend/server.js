require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const geoRoutes = require("./routes/geo");

const app = express();
app.use(cors());
app.use(express.json());

const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, require("./routes/auth"));
app.use(`${API_PREFIX}/geo`, require("./routes/geo"));
app.use(`${API_PREFIX}/health`, require("./routes/health"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
