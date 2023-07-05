import { pipeline } from "node:stream/promises";
import { Readable,Writable} from "node:stream";

 const read = new Readable({
    read(){
        this.push("teste")
        this.push("teste")
        this.push("teste")
        this.push("teste")
        this.push(null)
    }
 })

 const write = new Writable({
    write(chunk,encoding,cb){
        console.log(chunk.toString());
        cb()
    }
 })


try {
    await pipeline(
            read,
            write);

} catch (error) {
    console.log(("erro  "));
}

