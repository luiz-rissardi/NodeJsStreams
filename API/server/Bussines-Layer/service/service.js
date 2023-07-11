

export class UserService{
    #repository;
    constructor({repository}){
        this.#repository = repository;
    }

    async findUsers({select,where}){
        try {
            const users = await this.#repository.find();
            const selectedUsersStream = await users
                .select(...select)
                .where({query:where})
                .build();
            return selectedUsersStream;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    updadateUsers({query,setValue}){
        try {
            this.#repository.update({query,setValue});
            return "Usuario atualizado com sucesso";
        } catch (error) {
            throw new Error(error.message)
        }
    }

    addUser({user}){
        try {
            this.#repository.add({user});
            return "usuario adicionado com sucesso!";
        } catch (error) {
            throw new Error(error.message)
        }
    }

    deleteUsers({query}){
        try {
            this.#repository.delete({query});
            return "usuario deletado com sucesso";
        } catch (error) {
            throw new Error(error.message)
        }
    }
}