/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com','localhost'],
  },
  env: {
    API_URL:'https://glacial-river-12489.herokuapp.com',
    DEFAULTImage:'https://res.cloudinary.com/abhi-sawant/image/upload/v1653670527/user_dqzjdz.png'
},
}

module.exports = nextConfig
