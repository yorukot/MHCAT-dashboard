import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    const uriWithoutDb = process.env.MONGO_URI.split('/').slice(0, -1).join('/');
    await mongoose.connect(uriWithoutDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    });
  } catch (error) {
    console.error(error);
  }
};

export default connectMongo;
