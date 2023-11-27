import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";


function *generate(){
    for(let i=0;i<100;i++){
        yield Math.random() * 10;
    }
    return "fim!";
}

createReadStream("./readbleStream-FILE_SYSTEM/mock.json")
    .pipe(new Transform({
        async transform(chunk,encode,cb){
            const arr = JSON.parse(chunk);
            const data = arr.map(el => {
                const { genero , ...rest} = el;
                return rest
            })
            console.log();
            cb(null,Buffer.from(JSON.stringify(data)))
        }
    }))
    .pipe(new Transform({
        transform(chunk,encode,cb){
            const data = JSON.stringify(JSON.parse(chunk)).replace(/},{/gi,"},\n{")
            cb(null,data)
        }
    }))
    .pipe(new createWriteStream("readbleStream-FILE_SYSTEM/big.csv"));

