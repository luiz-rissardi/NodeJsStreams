import {Writable} from "node:stream"

export class UsersRepository {
    #dbConnection;
    #data;
    constructor({ dbConnection }) {
        this.#dbConnection = dbConnection;
    }


    async find() {
        try {
            this.#data = await this.#dbConnection.find()
            return this;
        } catch (error) {
            throw new Error("não foi possivel buscar os usuarios" + error);
        }
    }

    delete({query}) {
        try {
            this.#dbConnection.deleteMany(query);
            return "usuario deletado com sucesso";
        } catch (error) {
            throw new Error("não foi possivel deletar os dados " + error);
        }
    }

    update({query,setValue}) {
        try {
            this.#dbConnection.updateMany(query,{$set:setValue})
            return "usuario atualizado com sucesso";
        } catch (error) {
            throw new Error("não foi possivel atualizar o usuario");
        }
    }

    add({user}) {
        try {
            const InsertOptions = {
                forceServerObjectId:false
            }
            this.#dbConnection.insertOne(user,InsertOptions);
            return "usuario inserido com sucesso!";
        } catch (error) {
            throw new Error("não foi possivel inserir usuario no banco => " +error)
        }
    }

    select(...atributtes) {
        if (atributtes.length === 0) {
            return this;
        }
        const selected = {
            _id: false
        };
        atributtes.forEach(el => {
            selected[el] = true;
        })
        try {
            this.#data.project(selected);
        } catch (error) {
            throw new Error("não foi possivel selecionar " + atributtes + "=> " + error);
        }
        return this
    }

    where({query}) {
        try {
            this.#data.filter(query)
            return this
        } catch (error) {
            throw new Error("não foi possivel filtrar os dados")
        }
    }

    async build() {
        try {
            const UserStream = await this.#data.stream()
            return UserStream
        } catch (error) {
            throw new Error("erro ao contruir os dados finais => "+error);
        }
    }
}