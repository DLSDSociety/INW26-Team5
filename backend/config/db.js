
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('⏳ Connecting to MongoDB...');
  console.log('🔗 URI:', process.env.MONGO_URI?.replace(/:([^@]+)@/, ':****@')); // hides password

  try {
    mongoose.set('debug', true); // logs every query to terminal

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });

    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('📦 Database:', conn.connection.name);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connecstion failed');
    console.error('   Reason:', error.message);
    console.error('   Code:  ', error.code || 'N/A');
    process.exit(1);
  }
};

module.exports = connectDB;