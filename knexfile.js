require('dotenv').config();
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/migrations`
    },
    seeds: {
      directory: `${__dirname}/src/seeder`
    }
  }
};