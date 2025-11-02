import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('☑️  MongoDb Connection Successfull');
  } catch (error) {
    console.error('❌ MongoDb Connection Failed', error);
    process.exit(1);
  }
};
export default connectDb;
