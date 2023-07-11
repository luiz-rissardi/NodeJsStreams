import { UsersRepository } from "../../Acces-Layer/repository/repository.js"
import { UserService } from "../../Bussines-Layer/service/service.js";
import { MongoDb } from "../../Acces-Layer/data/database.js";

export class UserFactory {
    static async createInstance() {
        const db = new MongoDb("mongodb+srv://rissardiluiz2006:LvlPUFGf1mLsL3V2@stream.6v3eenw.mongodb.net/usuario")
        const dbConnection = await db.connect();
        const repository = new UsersRepository({ dbConnection })
        const userService = new UserService({ repository })
        return userService;
    }
}
