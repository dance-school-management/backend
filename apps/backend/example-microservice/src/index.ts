import { startServer } from "./utils/createApp";
import "reflect-metadata";
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