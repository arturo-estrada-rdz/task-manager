import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.info('Connecting');
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
