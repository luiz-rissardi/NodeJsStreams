
import {Stream, Writable} from "node:stream"
 
function *generateData(count){
    if(count < 1 ){
        return ;
    }
    const data = {nome:"luiz",idade:17};
    yield Buffer.from(JSON.stringify(data));
    yield *generateData(count-1)
}

Stream.Readable.from(generateData(5))
    .pipe(new Writable({
        encoding:"base64url",
        write(chunk,encoding,cb){
            //console.log(chunk.toString());
            console.log(encoding)
            cb()
        }
    }))