const mongoose = require("mongoose");
const uri = "mongodb://root:cfgmla23@mongodb:27017"

async function connect() {
    const activity = mongoose.createConnection(uri, {useNewUrlParser: true, dbName: "activitydb" });
    const auth = mongoose.createConnection(uri, {useNewUrlParser: true, dbName: "authdb" });

    console.log(mongoose.connection.readyState)
    return {activity: activity, 
            auth: auth
        };
}

async function disconnect() {
    await mongoose.disconnect()
}

module.exports = {connect, disconnect}