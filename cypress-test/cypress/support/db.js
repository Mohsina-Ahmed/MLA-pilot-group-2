const mongoose = require("mongoose");
// IP address on mongo container on docker network??
// const uri = process.env.CYPRESS_APP_MONGO_URI
const uri = process.env.CYPRESS_MONGO_URI

async function connect() {
    await mongoose.connect(uri, { useNewUrlParser: true})

    const activity = mongoose.connection.useDb('activitydb')
    const auth = mongoose.connection.useDb('authdb')
    
    // console.log(`Connection State: ${auth.readyState}`)

    return {activity: activity, 
            auth: auth,
        };
}

async function disconnect() {
    await mongoose.disconnect()
}

module.exports = {connect, disconnect}