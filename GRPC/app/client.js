import grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const serviceDefinitionProto = loadSync("./GRPC/schema.proto");
const YourServiceClient = grpc.loadPackageDefinition(serviceDefinitionProto).bookpackage.MessageService;
const client = new YourServiceClient("127.0.0.1:50451", grpc.credentials.createInsecure());
const request = {};

setTimeout(() => {
    client.sendMessage(request, (error, response) => {
        console.log(response);
    });
}, 200);