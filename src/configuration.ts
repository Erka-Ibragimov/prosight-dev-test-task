export default () => ({
  app: {
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
    environment: process.env.APP_ENV,
  },
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
