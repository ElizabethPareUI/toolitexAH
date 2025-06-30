const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Intentando conectar a MongoDB Atlas...');
    console.log('URI:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    
    console.log('✅ MongoDB Atlas conectado exitosamente');
    console.log('📊 Base de datos:', mongoose.connection.name);
    
    // Verificar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Colecciones disponibles:', collections.map(c => c.name));
    
    // Contar documentos en cada colección
    const counts = {};
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      counts[collection.name] = count;
    }
    
    console.log('📈 Conteo de documentos:', counts);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    if (error.message.includes('Authentication failed')) {
      console.log('🔐 Verifica las credenciales de MongoDB Atlas');
    }
    if (error.message.includes('not authorized')) {
      console.log('🌐 Verifica que tu IP esté en la whitelist de MongoDB Atlas');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    process.exit();
  }
};

testConnection();
