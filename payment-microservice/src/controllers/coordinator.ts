import { AdvancmentLevel, Course, DanceCategory, PrismaClient } from "@prisma/client"; 
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function createCourse(req: Request<{}, {}, Course>, res: Response) {
    // const { name, description, danceCategoryId, advancementLevelId } = req.body;
    // const course = await prisma.course.create({
    //     data: {
    //         name,
    //         description,
    //         danceCategoryId,
    //         advancementLevelId
    //     }
    // });
}

export async function createDanceCategory(req: Request<{}, {}, DanceCategory>, res: Response) {
    const { name, description } = req.body
    const danceCategory = await prisma.danceCategory.create({
        data: {
            name,
            description
        }
    })
    res.send(danceCategory);
}

export function createadvancementLevel(req: Request<{}, {}, AdvancmentLevel>, res: Response) {
    // const { name, description } = req.body

}


export function test(req: Request, res: Response) {
    res.send('hello test');
}


export function testing_post(req: Request<{}, {}, {test: string}>, res: Response) {
    res.send(`hello testing ${req.body.test}`);
}
