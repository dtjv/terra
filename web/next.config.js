module.exports = {
  eslint: {
    dirs: ['src'],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/delivery',
        permanent: true,
      },
      {
        source: '/',
        destination: '/admin/delivery',
        permanent: true,
      },
    ]
  },
}
