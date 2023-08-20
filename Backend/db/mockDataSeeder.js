require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')
const newsModel = require('../models/News.model')
const mockData = require('../mock_data.json')

const dbBaseUrl = process.env.DB_URL
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME

let uri = dbBaseUrl.replace('<password>', dbPassword)
uri = uri.replace('<db-name>', dbName)

const seedDb = async () => {
  try {
    await mongoose.connect(uri)
    console.log('db connection established')

    if (process.argv[2] === '--override') {
      await newsModel.deleteMany()
    }

    await newsModel.insertMany(mockData)

    const allData = await newsModel.find().exec()
    if (allData.length >= mockData.length) {
      console.log('seeding completed successfully')
    }
  } catch (err) {
    console.error('mongodb seeding error', err.message)
  } finally {
    await mongoose.connection.close()
    console.log('mongodb connection closed')
  }
}

seedDb();