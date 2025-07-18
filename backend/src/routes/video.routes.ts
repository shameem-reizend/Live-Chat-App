import express from 'express';
import { joinRoom } from '../controllers/video.controller';

const videoRoutes = express.Router();

videoRoutes.get('/', joinRoom);

export default videoRoutes;