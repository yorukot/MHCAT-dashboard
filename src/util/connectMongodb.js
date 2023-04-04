import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    });
  } catch (error) {
    console.error(error);
  }
};

export default connectMongo;
