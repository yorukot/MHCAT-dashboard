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
console.log(process.env.NODE_ENV)
module.exports = nextConfig



const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    silent: true,

    org: "mhcat",
    project: "javascript-nextjs",
  },
  {

    widenClientFileUpload: true,

    transpileClientSDK: true,

    tunnelRoute: "/monitoring",

    hideSourceMaps: true,

    disableLogger: true,

    enabled: process.env.NODE_ENV !== 'development',
  }
);
