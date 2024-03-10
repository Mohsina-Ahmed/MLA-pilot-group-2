const { defineConfig } = require('cypress')

const config = {
  apiUrl: process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost'
};

module.exports = defineConfig({
  e2e: {
    baseUrl: config.apiUrl,
  },
})