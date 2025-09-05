import mongoose from "mongoose";

const connectMongo = async () => {
  try {
    // Connect without specifying database in the connection string
    // Remove any database name from the MONGO_URI and connect to the cluster only
    const uriWithoutDb = process.env.MONGO_URI.split('/').slice(0, -1).join('/');
    await mongoose.connect(uriWithoutDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    });
    
    // Set the default database to mhcat-database
    mongoose.connection.useDb('mhcat-database');
  } catch (error) {
    console.error(error);
  }
};

// Helper function to get connection to a specific database
export const getDatabase = (dbName = 'mhcat-database') => {
  return mongoose.connection.useDb(dbName);
};

export default connectMongo;
