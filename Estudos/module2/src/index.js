import { Readable, Transform, Writable } from "stream";

function* gen(i) {
    if (i === 1) return;

    yield { nome: "luiz", idade: 17 };
    yield* gen(i - 1);
}

const stream = new Readable({
    objectMode: true,
    read() {
        for (const item of gen(10)) {
            const encoder = new TextEncoder();
            const binaryContet = encoder.encode(JSON.stringify(item));
            const unitArray8Data = new Uint8Array(binaryContet);
            this.push(unitArray8Data)
        }
        this.push(null);
    }
})

const transform = new Transform({
    objectMode:true,
    transform(chunk, enc, cb) {
        console.log(chunk);
        cb(null, chunk);
    }
})

const write = new Writable({
    objectMode: true,
    write(chunk, enc, cb) {
        //console.log(chunk);
        cb()
    }
})


stream
    .pipe(transform)
    .pipe(write);

