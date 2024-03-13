const { defineConfig } = require("cypress");
const { connect, disconnect } = require("./cypress/support/db");

const config = {
  apiUrl: process.env.REACT_APP_API_GATEWAY_URL || "http://localhost",
};

module.exports = defineConfig({
  // e2e: {
  //   setupNodeEvents(on, config) {
  //     on('task', {
  //       async clearDB() {
  // const { activity, auth } = await connect();
  // const exercises = activity.collection('exercises');
  // const users = auth.collection('users');
  // console.log('Cleaning the database');
  // await activity.dropCollection('exercises');
  // await auth.dropCollection('user');
  // await disconnect(); // Disconnect from the database after clearing
  //         return null;
  //       }
  //     });
  //   }
  // }
  env: {
    baseUrl: config.apiUrl,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
