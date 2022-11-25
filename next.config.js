/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com','localhost'],
  },
  env: {
    API_URL:'http://localhost:500',
    DEFAULTImage:'https://res.cloudinary.com/dfsvpju3j/image/upload/v1668419283/uysm6jaiy0hwwpestnkh.jpg'
},
}

module.exports = nextConfig
