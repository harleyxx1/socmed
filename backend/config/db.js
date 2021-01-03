const mongoose = require('mongoose')

const connect = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        console.log(`App is connect to Mongo db, ${con.connection.host}`)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connect;