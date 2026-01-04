import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daggerheart';

export async function connectDB(): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Attempting to connect to MongoDB...`);
  console.log(`[${timestamp}] MongoDB URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`[${timestamp}] Successfully connected to MongoDB`);
  } catch (error) {
    console.error(`[${timestamp}] MongoDB connection error:`, error);
    throw error;
  }

  mongoose.connection.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] MongoDB connection error:`, err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log(`[${new Date().toISOString()}] MongoDB disconnected`);
  });

  mongoose.connection.on('reconnected', () => {
    console.log(`[${new Date().toISOString()}] MongoDB reconnected`);
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log(`[${new Date().toISOString()}] Disconnected from MongoDB`);
}
