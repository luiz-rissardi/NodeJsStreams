import express from "express";
import http from "http";
import cors from "cors"
import { bodyParser } from "./helpers.js";

import { ApiRoutes } from "../Presentation-Layer/routes/routes.js";
import { UserController } from "../Presentation-Layer/controller/controller.js";
import { UserFactory } from "../Bussines-Layer/factory/factoryUserService.js";

const app = express();
const Server = http.createServer(app);

class ServerAPI {
    static async initServer() {
        try {
            const UserService = await UserFactory.createInstance();
            const controller = new UserController({ UserService });
            const routes = new ApiRoutes({ controller }).routes();
            app.use(cors());
            app.set("trust proxy", 1)
            app.use("/api",bodyParser, routes)
            Server.listen("4000",() => {
                console.log("servidor rodando !");
            })
        } catch (error) {
            console.log("erro ao iniciar servidor => " + error);
        }
    }
}

ServerAPI.initServer()


