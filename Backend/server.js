const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/project", require("./routes/projectRoute"));

app.use("/api/task", require("./routes/taskRoute"));

app.use("/api/user", require("./routes/userRoute"));

app.use("/api/taskAssignment", require("./routes/taskAssignmentRoute"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running On ${PORT}`);

});