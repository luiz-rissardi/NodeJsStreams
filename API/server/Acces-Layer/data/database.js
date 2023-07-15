import { MongoClient } from "mongodb";

export class MongoDb {
    #connectionString;
    constructor(connectionString) {
        this.#connectionString = connectionString;
    }

    async connect() {
        const client = new MongoClient(this.#connectionString, {
            useNewUrlParser: true
        })
        const connection = (await client.connect())
            .db("usuario")
            .collection("usuarios");
        this.#ErrorHnadling(client)
        return connection;
    }
    
    #ErrorHnadling(){
        const client = new MongoClient(this.#connectionString, {
            useNewUrlParser: true
        })

        client.on("commandFailed",(command)=>{
            console.log("teste = >" ,command);
        })
    }
}