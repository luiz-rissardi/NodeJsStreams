import { Readable, Writable, Transform, PassThrough, Duplex } from "stream";
import http from "http";
import { setTimeout } from "timers/promises";
import axios from "axios";

const app1 = (request, response) => {
    const readble = Readable.from(generate(10, "luiz"));
    readble.pipe(response)
    readble.on("end", () => {
        response.end()
    })
}

async function* generate(i, nome) {
    if (i <= 0) return;
    yield JSON.stringify({
        nome,
        idade: 17
    })
    yield* generate(i - 1, nome)
}

const server1 = http.createServer(app1);
const server2 = http.createServer(app1);


server1.listen(3000, () => {
    console.log("running at 3000");
})
server2.listen(4000, () => {
    console.log("running at 4000");
})

function getData(url) {
    const data = axios({
        method: "get",
        responseType: "stream",
        url: url
    })
    return data
}

const write = new Writable({
    write(chunk, enc, cb) {
        console.log(chunk.toString());
        cb();
    },
    final(cb){
        console.log("terminou");
    }
})

const mergeStreams = (streams) => streams.reduce((passThrough, stream) => {
    stream.pipe(
        passThrough,
        { end: false }
    );

    stream.on("end", () => {
        stream.ended = true;
        if (streams.every(stream => stream.ended)){
            passThrough.end();
        }
    })
    return passThrough
}, new PassThrough())



const URLS = ["http://localhost:4000", "http://localhost:3000"]
const requests = await Promise.all(
    URLS.map(getData)
)


const streams = requests.map(({ data }) => data);
mergeStreams(streams)
    .pipe(write)
