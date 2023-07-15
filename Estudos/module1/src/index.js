import { Readable, Writable, Transform, PassThrough } from "stream";
import { pipeline } from "stream/promises";
import http from "http";
import { setTimeout } from "timers/promises";
import axios from "axios";
import { deepStrictEqual } from "assert";

const app1 = (request, response) => {
    const readble = Readable.from(generate1());
    readble.pipe(response)
    readble.on("end", () => {
        response.end()
    })
}

const app2 = (request, response) => {
    const readble = Readable.from(generate2());
    readble.pipe(response)
    readble.on("end", () => {
        response.end()
    })
}

const server1 = http.createServer(app1);
const server2 = http.createServer(app2);


server1.listen(3000, () => {
    console.log("running at 3000");
})

server2.listen(4000, () => {
    console.log("running at 4000");
})

async function* generate1() {
    for (let i = 0; i < 100; i++) {
        await setTimeout(10)
        yield JSON.stringify({
            nome: `Luiz-${i}`,
            idade: 17
        })
    }
}

async function* generate2() {
    for (let i = 0; i < 100; i++) {
        await setTimeout(35)
        yield JSON.stringify({
            nome: `alana-${i}`,
            idade: 15
        })
    }
}



//////////// client

const URLS = ["http://localhost:4000", "http://localhost:3000"]
const requests = await Promise.all(
    URLS.map(getData)
)

try {
    const streams = requests.map(({ data }) => data);
    merge(streams)
        .pipe(output())


} catch (error) {
    console.log("error => ", error);
}

function getData(url) {
    const data = axios({
        method: "get",
        responseType: "stream",
        url: url
    })
    return data
}

function merge(streams) {
    return streams.reduce((prev, current, index, arr) => {
        current.pipe(
            prev,
            { end: false }
        )
        current.on("end", () => {
            current.ended = true;
            if (arr.every(el => el.ended)) {
                console.log("terminou");
                prev.end();
            }
        })
        return prev
    }, new PassThrough())
}

function output() {
    return new Writable({
        write(chunk, enc, cb) {
            console.log(JSON.parse(chunk.toString()));
            cb();
        }
    })
}


