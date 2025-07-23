
import http from 'http';
import { initSocket } from './socket';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './config/data-source'
import app from './app';

const PORT = Number(process.env.PORT) || 4000;
const server = http.createServer(app);

initSocket(server);

AppDataSource.initialize()
.then(() => {
        console.log("DB connection successful")
        server.listen(PORT, '0.0.0.0', () => {
        console.log(`The Server is Running on http://0.0.0.0:${PORT}`);
    });

}).catch((error: any) => {
    console.log("DB conncetion failed", error);
})
