import http from "http";
import express, { Router } from "express";

class User {
    constructor(nome) {
        this.nome = nome;
    }
}

const app = express();
const routes = Router();

routes.route("/user").get((req, res) => {
    const user = new User("luiz gustavo rissardi")
    res.json(user);
})

app.use(routes)

const server = http.createServer(app)

server.listen(5000, () => {
    console.log("server rodando !");
})

const init = performance.now();
fetch("http://localhost:5000/user")
    .then(data => data.json())
    .then(data => {
        const fim = performance.now();
        console.log(fim - init);
    })
