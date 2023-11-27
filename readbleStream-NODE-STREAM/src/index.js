
import { createWriteStream } from "node:fs";
import { Readable, Writable, Transform } from "node:stream";

function* fatorial(numbersOfObject) {
    if (numbersOfObject < 1) {
        return;
    }
    yield { nome: `luiz-${numbersOfObject}`, timestamp: Date.now() };
    yield* fatorial(numbersOfObject - 1)
}

const readble = new Readable({
    async read() {
        for await (let data of fatorial(5)) {
            this.push(JSON.stringify(data));
        }
        this.push(null);
    }
})

const mapperData = new Transform({
    transform(chunk, enconding, cb) {
        const data = JSON.parse(chunk.toString())
        const mapperData = `${data.nome} ${data.timestamp}`
        cb(null, mapperData);
    }
})

const mapperHeaders = new Transform({
    transform(chunk, enconding, cb) {
        this.counter = this.counter ?? 0;
        if (this.counter == 0) {
            this.counter++
            cb(null, `nome timestamp \n`.concat(chunk.toString()))
        }
        else {
            this.counter++
            cb(null, "".concat("\n") + chunk.toString())
        }
    }
})

const writeble = new Writable({
    write(chunk, encoding, cb) {
        console.log(chunk.toString());
        cb()
    }
})

readble
    .pipe(mapperData)
    .pipe(mapperHeaders)
    .pipe(createWriteStream("teste.csv"))