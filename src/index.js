const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = 3000;
const connect = require("./config/db")
const cookieParser = require('cookie-parser');

const http = require("http")
const socketIo = require("socket.io")

const route = require("./routes");

const server = http.createServer(app);
const io = socketIo(server);

// Cấu hình cors : chia sẻ nguồn tài nguyên cho người khác
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

// static public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "upload")));

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

// Socket.io
// io.on("connection", (socket) => {
//     console.log(`User Connected: ${socket.id}`);

//     socket.on("join_room", async (data) => {
//         const { ID_User, room } = data;
//         const res = await MessageService.createRoom({ userOne: ID_User });
//         if (res) {
//             socket.join(+res.DT.id);
//             console.log("tham gia phong chat : ", res.DT.id);
//             socket.emit("room_created", res.DT.id);
//         }
//     });

//     socket.on("join_room_admin", async (data) => {
//         const { room } = data;
//         socket.join(+room);
//         socket.emit("room_created", room);
//         console.log("admin tham gia phong chat : ", room);
//     });

//     socket.on("send_message", async (data) => {
//         const { text, room, ID_User } = data;
//         console.log("đata create", data);
//         socket.to(room).emit("receive_message", data);
//     });
// });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})