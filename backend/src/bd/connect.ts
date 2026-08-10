import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mi_proyecto_fullstack';

export async function conectarBaseDeDatos(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🚀 ¡Conexión exitosa a MongoDB Local!');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1); 
  }
}

conectarBaseDeDatos();