import { Server } from 'socket.io';

export const initSocket = (server: any) => {

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true, 
        }
    })
    io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        next();
    } else {
        next(new Error('Authentication error'));
    }
    });

    io.on('connection', (socket) => {
    console.log("User Connected", socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", {
        message: data.message,
        senderId: data.senderId,
        receiverId: data.receiverId
        });
        console.log(`Message sent to room ${data.room}:`, data.message, "from user", data.senderId, "to user", data.receiverId);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
    });
}