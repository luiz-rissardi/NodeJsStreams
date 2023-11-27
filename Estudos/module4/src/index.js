import grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

class User {
    constructor(nome) {
        this.nome = nome
    }
}

const packageDefinition = loadSync("Estudos/module4/src/teste.proto"); // bloqueante
const YourService = grpc.loadPackageDefinition(packageDefinition).bookpackage.MyService;
const server = new grpc.Server();

server.addService(YourService.service, {
    teste: (call, callback) => {
        const user = new User("luiz")
        callback(null, { ...user });
    },
});


server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error("Erro ao vincular o servidor:", err);
    } else {
        console.log(`Servidor gRPC iniciado em 127.0.0.1:${port}`);
        server.start();
    }
});




const packageDefinitionClient = loadSync("Estudos/module4/src/teste.proto");

const YourServiceClient = grpc.loadPackageDefinition(packageDefinitionClient).bookpackage.MyService;
const client = new YourServiceClient("127.0.0.1:50051", grpc.credentials.createInsecure());

const request = { /* Seu owbjeto de solicitação aqui */ };

const initi = performance.now();
client.teste(request, (error, response) => {
    const fim = performance.now();
    console.log(fim - initi);
    if (error) {
        console.error("Erro na chamada do método:", error);
    } else {
        console.log("Resposta do servidor:", response);
    }
});