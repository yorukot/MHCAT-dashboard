import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("┃          成功連線至資料庫            ┃");
  } catch (error) {
    console.error(error);
  }
};

export default connectMongo;
