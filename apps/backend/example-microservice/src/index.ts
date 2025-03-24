import { startServer } from "./createApp";
import "reflect-metadata";
import { AppDataSource } from "./dataSource";
import { User } from "./entity/User";
import 'dotenv/config';
const PORT = process.env.PORT || 3000;

startServer().then(async (app) => {
    try {
        app.listen(PORT, () => {
        console.log(`Running on Port: ${PORT}`);
    })
} catch(e: any) {
    console.error(e.message);
}
}).catch((e) => {
    console.error(e.message);
})