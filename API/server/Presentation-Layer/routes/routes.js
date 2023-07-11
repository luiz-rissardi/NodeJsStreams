import { Router } from "express";


export class ApiRoutes {
    #controller;
    constructor({ controller }) {
        this.#controller = controller;
    }

    routes() {
        const routes = Router();

        routes.route("/getUsers").post((req, res) => {
            this.#controller.findUsers(req, res);
        })

        routes.route("/getAllUsers").get((req, res) => {
            this.#controller.findAllUser(req, res);
        })

        routes.route("/updateUsers").put((req, res) => {
            this.#controller.updateUsers(req, res);
        })

        routes.route("/deleteUsers").delete((req,res)=>{
            this.#controller.deleteUsers(req,res);
        })

        routes.route("/createUser").post((req,res)=>{
            this.#controller.createUser(req,res)
        })
        return routes;
    }
}