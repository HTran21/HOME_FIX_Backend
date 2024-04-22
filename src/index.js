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
const messageService = require('./services/messageService');
const payementService = require('./services/payementService');

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
io.on("connection", (socket) => {
    // console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", async (data) => {
        // const { ID_User, room } = data;
        const ID_User = data.senderId;
        const res = await messageService.createRoom(ID_User)
        if (res) {
            socket.join(+res.data.id)
            // console.log("Tham gia phong chat: ", res.data.id)
            socket.emit("room_created", res.data.id)
        }
        io.emit("update_admin_room_list");
    });

    socket.on("join_room_admin", async (data) => {
        const { room } = data;
        socket.join(+room);
        socket.emit("room_created", room);
        // console.log("admin tham gia phong chat : ", room);
    });

    socket.on("send_message", async (data) => {
        const { room } = data;
        // console.log("room", room);
        // console.log("Toi day")
        socket.to(room).emit("receive_message", data);
    });

    socket.on("confirm_payment", async (data) => {
        const { id } = data
        const message = data.message
        // console.log("message", message)
        io.emit("confirm_payment_success", message)

    })
    // socket.on("accept_form", async (data) => {
    //     io.emit("accept_form_success")

    // })

    socket.on("orderStatusChange", async (data) => {
        io.emit("featchOrder")
    })

});


server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})