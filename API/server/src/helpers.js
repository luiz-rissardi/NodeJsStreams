export function bodyParser(req,res,next){
    let body = '';
    if(req.method != "GET"){
        req.on("data",chunk => {
            body += chunk.toString()
        });
        
        req.on("end",()=>{
            req.body = JSON.parse(body)
            next()
        })
    }
    next()
}

