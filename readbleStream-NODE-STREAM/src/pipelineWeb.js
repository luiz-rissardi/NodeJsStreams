
import { pipeline } from "node:stream/promises";
import { Readable, Writable } from "node:stream";

 const read = Readable.toWeb(new Readable({
    read(){
        {
            this.push("teste")
            this.push("teste")
            this.push("teste")
            this.push(null)
         }
    }
 }))

const write = new Writable({
    write(chunk,enc,cb){
        console.log(chunk.toString())
       cb()
    }
})

try {
    await pipeline(
            read,
            write);

} catch (error) {
    console.log(error);
}

// read.pipeTo(new WritableStream({
//     write(chunk,controller){
//         console.log("inicio---->");
//         console.log(chunk);
//     }
// }))