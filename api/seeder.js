const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users.js');
const products = require('./data/products.js');
const User = require('./models/User.js');
const Product = require('./models/Product.js');
const Order = require('./models/Order.js');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users one by one to trigger pre-save hook
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      // Asegurar precio mínimo de 1000
      const price = product.price < 1000 ? 1000 : product.price;
      return { ...product, price, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();

  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }

  await mongoose.disconnect();
  console.log('MongoDB Disconnected.');
  process.exit();
};

runSeeder();
