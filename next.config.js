/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate");

// const nextConfig = {
//   reactStrictMode: true,
// }

//module.exports = nextConfig
module.exports = nextTranslate({
  env: {
    REACT_APP_API: "http://localhost:3000",
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
});
