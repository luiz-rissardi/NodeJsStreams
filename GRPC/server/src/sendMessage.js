
class Message{
    constructor(message,id,phone) {
        this.message = message;
    }
}

export const sendMessage = (call,callback) => {
    const message = new Message("ola tudo bem?");
    callback(null,{ message: 'ola tudo bem?' });
}