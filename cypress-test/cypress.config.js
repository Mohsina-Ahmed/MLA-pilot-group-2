const { defineConfig } = require("cypress");
const { connect, disconnect } = require("./cypress/support/db");

console.log(process.env.CYPRESS_API_GATEWAY_URL)

module.exports = defineConfig({
  video: true,
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async connectAndCleanDB() {
            const { activity, auth } = await connect();
              activity.collection('exercises').deleteMany({username: 'testUser'})
              auth.collection('users').deleteOne({username: 'testUser'})

            // console.log('Removed testUser from database!!')
            return null;
        }, 
        async disconnectDB() {
          await disconnect()
        }
      });
    }
  },
  env: {
    // IP address of docker compose network!!!!!!!
    baseUrl: process.env.CYPRESS_API_GATEWAY_URL
  },

  // e2e: {
  //   setupNodeEvents(on, config) {
  //     // implement node event listeners here
  //   },
  // },
});
