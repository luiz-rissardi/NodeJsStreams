

const [start,pause] = ["start","pause"].map(el => document.getElementById(el));

let controller = new AbortController();
start.addEventListener("click",async ()=>{
    controller = new AbortController();
    const data = await get(controller.signal)
})

pause.addEventListener("click",()=>{
    controller.abort();
    controller = new AbortController();
})

async function get(signal) {
    const data = await fetch("http://localhost:3000/api/updateUsers", {
        method: "PUT",
        body:JSON.stringify({
            query:{idade:{"$gt":20}},
            setValue:{nome:"Antonyo"}
        }),
        signal
    });
    const reader = data.body
        .pipeThrough(new TextDecoderStream())
        .pipeTo(new WritableStream({
            write(chunk,controller){
                console.log(chunk);
            }
        }))
    return reader
}