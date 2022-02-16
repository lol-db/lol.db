const db = require('../index.js')('something.db')
db.set('a', 69) // sets value for a (69)
console.log(db.get('a')) // returns 69

db.set('a') // invalid syntax
console.log(db.size(true))

console.log(db.keys())