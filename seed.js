const axios = require('axios');
const mongoose = require('mongoose');
const ProductTransaction = require('./src/models/product');

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URL ?? 'mongodb://127.0.0.1:27017/EthnusProject');

  await ProductTransaction.deleteMany({});

  const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

  await ProductTransaction.insertMany(data);

  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDatabase();
