export default () => ({
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME || 'kupipodariday',
    username: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    synchronize: true,
  },
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_key',
    expiresin: process.env.JWT_EXPIRESIN || '30d',
  },
});
