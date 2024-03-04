import https from "https"

const options = {}

const server = https.createServer(options,(req,res)=>{
    res.write("teste");
    res.end();
})

server.listen("3000",()=>{
    console.log("running");
})


const options2 = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };
  
  const req = https.request(options2, (res) => {
    // ...
  });