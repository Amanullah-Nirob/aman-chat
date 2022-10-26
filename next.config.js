/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com','localhost'],
  },
  env: {
    API_URL:'https://aman-chat-backend.vercel.app',
    DEFAULTImage:'https://res.cloudinary.com/abhi-sawant/image/upload/v1653670527/user_dqzjdz.png'
},
}

module.exports = nextConfig
