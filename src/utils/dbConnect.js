import mongoose from 'mongoose'

const connectMongoDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    await mongoose.connect(process.env.MONGODB_URL ?? 'mongodb://127.0.0.1:27017/EthnusProject')
    console.log('DB Connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

export default connectMongoDB