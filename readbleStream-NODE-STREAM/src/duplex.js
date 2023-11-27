
import { Duplex ,Readable} from "node:stream";

function* generateData(numbersOfObject){
    if(numbersOfObject < 1){
        return;
    }
    yield { nome:`luiz-${numbersOfObject}`, timestamp:Date.now() };
    yield* generateData(numbersOfObject -1)
}


const duplex = new Duplex({
    objectMode:true,
    async read(){
        for await(let item of generateData(4)){
            const data = JSON.stringify(item);
            this.push(data)
        }
        this.push(null)
    },

    write(chunk,encoding,cb){
        const data = JSON.parse(chunk);
        console.log(data)
        cb();
    }
});



duplex.pipe(duplex)