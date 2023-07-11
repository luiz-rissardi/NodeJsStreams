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
        return connection;
    }
}