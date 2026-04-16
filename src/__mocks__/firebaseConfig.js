// Global mock for src/firebaseConfig.js
// Prevents Firebase SDK from loading (and requiring fetch) in tests.
module.exports = {
  auth: {},
  db: {},
  analytics: null,
}
