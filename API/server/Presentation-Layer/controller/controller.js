import { Readable, Transform, Writable } from "node:stream"
import { pipeline } from "node:stream/promises"
import { setTimeout } from "node:timers/promises"


export class UserController {
    #UserService;
    constructor({ UserService }) {
        this.#UserService = UserService;
    }

    async createUser(req, res) {
        try {
            const { user } = await getBodyOfRequest(req)
            const result = this.#UserService.addUser({ user })
            req.status(200).send(result);
            res.ens();
        } catch (error) {
            res.status(200).send("erro ao acessar UserService => " + error);
            res.end();
        }
    }

    async updateUsers(req, res) {
        try {
            const { query, setValue } = await getBodyOfRequest(req)
            const result = this.#UserService.updadateUsers({ query, setValue })
            res.status(200).send(result);
            res.end();
        } catch (error) {
            res.status(400).send("erro ao atualizar usuario");
            res.end();
        }
    }

    async deleteUsers(req, res) {
        try {
            const { query } = await getBodyOfRequest(req)
            const result = this.#UserService.deleteUsers({ query });
            res.status(200).send(result);
            res.end();
        } catch (error) {
            res.status(400).send("erro ao acessar UserService => " + error);
            res.end();
        }
    }

    async findUsers(req, res) {
        try {
            const { where, select } = await getBodyOfRequest(req)
            const stream = await this.#UserService.findUsers({ select, where });
            pipeline(
                Readable
                    .from(JsonToString(stream)),
                toNdString(),
                sendData(res)
            )
        } catch (error) {
            res.status(400).end("não foi possivel buscar os usuarios, verifique se o 'select' e 'where' foram informados ");
        }
    }

    async findAllUser(req, res) {
        try {
            const stream = await this.#UserService.findUsers({ select: [], where: undefined });
            pipeline(
                Readable
                    .from(JsonToString(stream)),
                toNdString(),
                sendData(res)
            )
        } catch (error) {
            console.log(error);
            res.status(400).end("não foi possivel buscar os usuarios, entre em contato com o suporte")
        }
    }
}

async function* JsonToString(stream) {
    for await (let item of stream) {
        yield JSON.stringify(item)
    }
}

function toNdString() {
    return new Transform({
        async transform(chunk, enc, cb) {
            await setTimeout(100);
            const data = chunk.toString().concat("\n");
            cb(null, data)
        }
    })
}

function sendData(res){
    return new Writable({
        write(chunk,enc,cb){
            res.write(chunk.toString());
            cb()
        }
    })
}

async function getBodyOfRequest(request) {
    let body = "";
    await request.on("data", (dados) => {
        body += dados.toString();
    })
    return JSON.parse(body);
}