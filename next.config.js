/** @type {import('next').NextConfig} */
require('dotenv').config()

const mongoose = require("mongoose")

try {
  mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false
  }).then(console.log('Connected to mongodb'))
} catch (error) {
  console.error(error);
}

const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
