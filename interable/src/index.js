import { performance } from "node:perf_hooks";
import { Readable,Writable,Transform } from "node:stream";

function* generate(i){
    if(i===0){
        return ;
    }
    yield {nome:"luiz",idade:17};
    yield *generate(i-1);
}


const init = performance.now()
const data = new Readable({
    read: function(){
        for(let item of generate(10)){
            this.push(JSON.stringify(item));
        }
        this.push(null);
    },
})

const fim = performance.now();
data.on("data",(chunk)=>{
    //console.log(chunk);
})

console.log(fim-init);
