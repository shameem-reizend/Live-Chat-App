import { NextFunction, Request, Response } from "express";
import { v4 as uuidV4 } from 'uuid';

export const joinRoom = (req: Request, res: Response, next: NextFunction) => {
    res.redirect(`/${uuidV4()}`);
}