import { Readable, Stream } from "node:stream";

function *generateData(count){
    if(count < 1 ){
        return ;
    }
    const data = {nome:"luiz",idade:17};
    yield Buffer.from(JSON.stringify(data));
    yield *generateData(count-1)
}

function CreateStream(){
    return new Readable({
        read(){
            for(let item of generateData(10)){
                this.push(JSON.stringify(item))
            }
            this.push(null)
        },
       
    })
}

Readable.toWeb(CreateStream())
    .pipeThrough(new TransformStream({
        transform(chunk,contoller){
            const content = JSON.parse(Buffer.from(chunk)).data
            const data = JSON.parse(Buffer.from(content))
            contoller.enqueue(data)
        }
    }))
    .pipeTo(new WritableStream({
        write(chunk){
            console.log(chunk);
        }
    }))

