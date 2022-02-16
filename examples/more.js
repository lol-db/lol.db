const db = require('../index.js')('more.db')

let d = { test: "something" }
db.raw.assign(d, 'raw.assign.works', 47)
db.setAll(d)
console.log(db.get('test'))