// native example of readble streans
function * generate(){
    for(let i=0;i<100;i++){
        yield Math.random()*10 + 1
    }
    return "fim!"
}


const data = new ReadableStream({
    start(controller){
        for( let item of generate()){
            controller.enqueue(item)
        }
        controller.enqueue(null)
    }
})

data
    .pipeThrough(new TransformStream({
        transform(chunk,controller){
            const data = Math.floor(chunk);
            controller.enqueue(data)
            
        }
    }))
    .pipeTo(new WritableStream({
    write(chunk){
        console.log(chunk)
    }
}))
