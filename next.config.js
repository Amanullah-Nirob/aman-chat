const runtimeCaching = require("next-pwa/cache");
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	register: true,
	scope: '/',
	sw: 'service-worker.js',
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/]
 })
  
module.exports = withPWA({
    images: {
      domains: ['res.cloudinary.com','localhost'],
    },
})