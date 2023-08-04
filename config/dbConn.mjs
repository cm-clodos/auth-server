import mongoose from "mongoose";

const connectDB = async () => {
  try{
    await mongoose.connect('mongodb://localhost/nodeauth', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Verbunden mit MongoDB')
  } catch (error) {
    console.error('Fehler beim Verbinden mit MongoDB:', error)
  }
}

export default connectDB;