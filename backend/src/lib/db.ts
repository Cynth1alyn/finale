import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:examplepassword@localhost:27017/techjob?authSource=admin';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
  }
};
