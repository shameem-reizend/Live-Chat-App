
import http from 'http';
import { initSocket } from './socket';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './config/data-source'
import app from './app';

const PORT = process.env.PORT;
const server = http.createServer(app);

initSocket(server);

AppDataSource.initialize()
.then(() => {
        console.log("DB connection successful")
        server.listen(PORT, () => {
        console.log(`The Server is Running on http://localhost:${PORT}`);
    })
}).catch((error: any) => {
    console.log("DB conncetion failed", error);
})
