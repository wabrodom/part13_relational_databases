const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage} = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {})

const migrationConf = {
  migrations: { glob: 'migrations/*.js'},
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
}

const runMigrations = async() => {
  const migrator = new Umzug(migrationConf)

  const migrations = await migrator.up()
  console.log('Migrations up to date' , { files:  migrations.map(mig => mig.name) })
}

const rollbackMigration = async() => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}


const connectToDatabase = async() =>{
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database...')
  } catch(error) {
    console.log('failed to connect to the database !!!')
    return process.exit(1)
  }
}

module.exports = { sequelize, connectToDatabase, rollbackMigration}