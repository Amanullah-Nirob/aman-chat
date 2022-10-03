/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    API_URL:'http://localhost:5000',
    DEFAULTImage:'https://res.cloudinary.com/abhi-sawant/image/upload/v1653670527/user_dqzjdz.png'
},
}

module.exports = nextConfig
