import { connect, set, Schema, model } from "mongoose";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

set("strictQuery", true);
await connect("mongodb+srv://rissardiluiz2006:LvlPUFGf1mLsL3V2@stream.6v3eenw.mongodb.net/usuario");

const schema = new Schema({
  nome: {
    type: String,
    required: true
  },
  idade: {
    type: Number,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
});



const UserModel = model("usuario", schema);

async function* getData() {
  const cursor = UserModel.find().lean().batchSize(100).cursor();
  for await (const user of cursor) {
    yield JSON.stringify(user);
  }
}

const readbleStream = Readable.from(getData());

const writebleStream = new Writable({
  async write(chunk, enc, cb) {
    console.log(JSON.parse(chunk.toString()));
    cb();
  },

  final() {
    console.log("acabou");
  }
});

await pipeline(readbleStream, writebleStream);

