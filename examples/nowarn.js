const db = require('../index.js')('something.db', true)
db.set('thisworked.confirmed', 'something')
db.set('thisworked.data', 'something')
db.set('thisworked.is', 'something')
db.set('thisworked.working', 'something')
db.set('thisworked.if', 'something')
db.set('thisworked.this', 'something')
db.set('thisworked.works', 'something')


/* these functions will not work because of invalid syntax, but there will be no warning messages. All of these will return null btw. */

db.set('this')
db.push('this')
db.subtract('this')
db.add('this')
db.removeFromArray('this')
db.get()
db.delete()

/* ---- */
console.log(db.get('thisworked'))
console.log(db.get('thisworked.confirmed'))