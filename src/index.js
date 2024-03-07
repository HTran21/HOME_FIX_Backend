const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = 3000;
const connect = require("./config/db")
const cookieParser = require('cookie-parser');

const route = require("./routes");

// Cấu hình cors : chia sẻ nguồn tài nguyên cho người khác
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

// parse application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(
    express.urlencoded({
        extended: true,
    })
);

// cookieParser
app.use(cookieParser())

// parse application/json
app.use(express.json());



// // cors
// app.use(cors());


// static path
app.use(express.static(path.join(__dirname, "public")));

// connect db
connect();

// router
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})