const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const users = require('./data/users.js');
const products = require('./data/products.js');
const User = require('./models/User.js');
const Product = require('./models/Product.js');
const Order = require('./models/Order.js');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('ERROR: MONGO_URI is not defined. Check your .env file in the /api directory.');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(`Error connecting to DB: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Hashear contraseñas antes de insertar
    const usersWithHashedPasswords = await Promise.all(users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
    }));

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    const adminUser = createdUsers.find(u => u.isAdmin)._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    await mongoose.disconnect();

  } catch (error) {
    console.error(`Error importing data: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    await mongoose.disconnect();

  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

const main = async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }
}

main();