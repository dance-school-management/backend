import { Request, Response, NextFunction } from "express-serve-static-core";
import { AppDataSource } from "../dataSource";
import { User } from "../entity/User";
import { validationResult } from "express-validator";




export async function registerUser(req: Request<{}, {}, User>, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.save(req.body);
        res.status(200).send(user);
        return;
    }
    res.send({ errors: result.array() });
}

export function loginUser(req: Request, res: Response, next: NextFunction) {
    
}