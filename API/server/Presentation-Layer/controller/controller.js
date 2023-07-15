
//import { performance } from "node:perf_hooks";
import { PassThrough, Readable, Transform, Writable } from "stream"
import { pipeline } from "node:stream/promises"
import { setTimeout } from "node:timers/promises"


export class UserController {
    #UserService;
    constructor({ UserService }) {
        this.#UserService = UserService;
    }

    createUser(req, res) {
        try {
            const { user } = req.body
            const result = this.#UserService.addUser({ user })
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send("não foi possivel criar um usuario");
        }finally{
            res.end();
        }
    }

    updateUsers(req, res) {
        try {
            const { query, setValue } = req.body;
            const result = this.#UserService.updadateUsers({ query, setValue })
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send("erro ao atualizar usuario");
        }finally{
            res.end();
        }
    }

    deleteUsers(req, res) {
        try {
            const { query } = req.body
            const result = this.#UserService.deleteUsers({ query });
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send("erro ao deletar usuario");
        }finally{
            res.end()
        }
    }

    async findUsers(req, res) {
        try {
            const { where, select } = req.body;
            const stream = await this.#UserService.findUsers({ select, where });
            pipeline(
                Readable
                    .from(JsonToString(stream)),
                groupBy(25),
                toNdString(),
                sendData(res)
            )
        } catch (error) {
            res.status(400).end("não foi possivel buscar os usuarios, verifique se o 'select' e 'where' foram informados =>" + error.message);
        } finally{
            res.end();
        }
    }

    async findAllUser(req, res) {
        try {
            const stream = await this.#UserService.findUsers({ select: [], where: undefined });
            await pipeline(
                Readable.from(JsonToString(stream)),
                groupBy(25),
                toNdString(),
                sendData(res)
            );
        } catch (error) {
            res.status(400).end("não foi possivel buscar os usuarios, entre em contato com o suporte => " + error.message);
        }finally{
            res.end();
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
        transform(chunk, enc, cb) {
            const data = chunk.toString().concat("\n");
            cb(null, data)
        }
    })
}

function groupBy(sizeOfGroup) {
    let isTree = 0;
    const group = []
    return new Transform({
        transform(chunk, enc, cb) {
            if (isTree % sizeOfGroup === 0 && isTree !== 0) {
                isTree = 0;
                this.push(JSON.stringify(group));
                group.splice(0)
                cb();
            } else {
                group.push(chunk.toString());
                isTree++;
                cb();
            }
        },
        flush(cb) {
            this.push(JSON.stringify(group))
            cb();
        }
    })
}

function sendData(res) {
    return new Writable({
        write(chunk, enc, cb) {
            res.write(chunk.toString());
            cb()
        }
    })
}



