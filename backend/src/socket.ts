import { Server } from 'socket.io';
import { setUserOffline, setUserOnline } from './services/userStatus.services';

export const initSocket = (server: any) => {

    const io = new Server(server, {
        cors: {
            // origin: 'http://16.16.76.226:3000',
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
        const userId = socket.handshake.query.userId as string;

        if (!userId) {
            socket.disconnect();
            return;
        }

        setUserOnline(userId);

        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("send_message", (data) => {

            console.log(data.message);
            socket.to(data.room).emit("receive_message", {
            message: data.message,
            senderId: data.senderId,
            receiverId: data.receiverId
            });
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
            setUserOffline(userId);
        });
    });
}