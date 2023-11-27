import protobuf from "protobufjs";

const [oldBook] = [
    {
        nome: "luiz",
        idade: 17,
    },
];

async function main() {
    // Carregando a definição do protocolo
    const root = await protobuf.load("./Estudos/module3/src/book.proto");
    const Book = root.lookupType("bookpackage.Book");

    // Codificando oldBook
    const data = Book.encode({
        nome:"luiz"
    });

    // Decodificando e verificando
    // const teste = Book.create(oldBook)
    // const book = Book.decode(data);
    // const error = Book.verify(book);
    // if (error) throw Error(error);

    // Juntando oldBook e o livro decodificado
    const mergedBook = Object.assign(oldBook);

    console.log(data);
}

// Chamando a função principal
main();
