import { loadSync } from "@grpc/proto-loader"; 
import grpc from "@grpc/grpc-js";
import { sendMessage } from "./src/sendMessage.js";

const server = new grpc.Server();
const serviceDefinitionProto = loadSync("./GRPC/schema.proto");
const MessageService = grpc.loadPackageDefinition(serviceDefinitionProto).bookpackage.MessageService;

server.addService(MessageService.service,{
    sendMessage
});

server.bindAsync("127.0.0.1:50451",grpc.ServerCredentials.createInsecure(),(err,port) => {
    if(err) throw err;
    console.log(`microservisse run at ${port}`);
    server.start();
})



