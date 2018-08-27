export const environment = {
  server: {
    port: process.env.PORT || 5100
  },
  hydra: {
    host: process.env.HYDRA_URL || 'http://localhost',
    port: process.env.HYDRA_PORT || 4445
  }
}