const fs = require("fs")
const ppath = require("path")
const chalk = require("chalk")

/* Assign */
function assign(obj, prop, value) {
  if(typeof prop === "string") {
    prop = prop.split(".");
  }
  if (prop.length > 1) {
    let e = prop.shift();
    assign(obj[e] = Object.prototype.toString.call(obj[e]) === "[object Object]" ? obj[e] : {}, prop, value);
  } else {
    obj[prop[0]] = value;
  }
}

/* Deletes An Obj Path */
function deleteObjPath(obj, path) {
  if(!obj || !path) {
    return;
  }
  if(typeof path === 'string') {
    path = path.split('.');
  }
  for(let i = 0; i < path.length - 1; i++) {
    obj = obj[path[i]];
    if (typeof obj === 'undefined') {
      return;
    }
  }
  delete obj[path.pop()];
};

module.exports = function(path, options) {
  if(!options) options = { disableWarnMessage: false };
  if(typeof options !== 'Object') options = { disableWarnMessage: options }
  if(!path) {
    path = ppath.join('./loldb.json')
  }

  let d = {}
  if(!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}), 'utf8');
  } else {
    d = JSON.parse(fs.readFileSync(path, 'utf8'))
  }

  return {
    get(key) {
      if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}), 'utf8');
      if(!key && options.disableWarnMessage !== true) return console.warn(chalk.hex('#ffbf00').bold("[lol.db] ") + "Please make sure you use the right syntax for the " + chalk.hex('#eb8f34').bold("get") + " function, per example: \n" + chalk.hex('#4287f5').bold('<db>.get(\'mykey\')\n'));
      if(!key && options.disableWarnMessage === true) return null;

      if(key.includes('.')) {
        let allparams = `${key}`.split('.')
        let lastd = [];
        let lastn = -1
        for(let i = 0; i < allparams.length; i++) {
          let param = allparams[i];
          if(lastn === -1) {
            if(!d[param]) {
              return undefined;
            } else {
              lastd.push(d[param])
            }
          } else {
            let currd = lastd[lastn];
            if(!currd) {
              return undefined;
            } else {
              lastd.push(currd[param])
            }
          }
          lastn += 1;
        }
        return lastd[lastn];
      } else {
        if(!d[key]) {
          return undefined;
        } else {
          return d[key];
        }
      }
    },
    set(key, value) {
      if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}), 'utf8');
      if(!key && options.disableWarnMessage !== true || !value && options.disableWarnMessage !== true) return console.warn(chalk.hex('#ffbf00').bold("[lol.db] ") + "Please make sure you use the right syntax for the " + chalk.hex('#eb8f34').bold("set") + " function, per example: \n" + chalk.hex('#4287f5').bold('<db>.set(\'mykey\', \'myvalue\')\n'));
      if(!key && options.disableWarnMessage === true || !value && options.disableWarnMessage === true) return null;
      if(key.includes('.')) {
        assign(d, key, value);
      } else {
        d[key] = value;
      }
      fs.writeFileSync(path, JSON.stringify(d), 'utf8')
    },
    add(key, value) {
      if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}), 'utf8');
      if(!key && options.disableWarnMessage !== true || !value && options.disableWarnMessage !== true || isNaN(value) && options.disableWarnMessage !== true) {
        let content = '\n'
        if(isNaN(value)) content = '\n' + chalk.hex('#ff2600').bold('Don\'t forget that the value should be a number!\n');
        console.warn(chalk.hex('#ffbf00').bold("[lol.db] ") + "Please make sure you use the right syntax for the " + chalk.hex('#eb8f34').bold("add") + " function, per example: \n" + chalk.hex('#4287f5').bold('<db>.add(\'mykey\', 100)') + content);
      } else {
        if(!key && options.disableWarnMessage === true || !value && options.disableWarnMessage === true || isNaN(value) && options.disableWarnMessage === true) return null;
        let v = this.get(key)
        if(!v) v = 0;
        let a = new Function(`return ${v} + ${value}`)()
        this.set(key, a)
        fs.writeFileSync(path, JSON.stringify(d), 'utf8')
      }
    },
    subtract(key, value) {
      if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}), 'utf8');
      if(!key && options.disableWarnMessage !== true || !value && options.disableWarnMessage !== true || isNaN(value) && options.disableWarnMessage !== true) {
        let content = '\n'
        if(isNaN(value)) content = '\n' + chalk.hex('#ff2600').bold('Don\'t forget that the value should be a number!\n');
        console.warn(chalk.hex('#ffbf00').bold("[lol.db] ") + "Please make sure you use the right syntax for the " + chalk.hex('#eb8f34').bold("subtract") + " function, per example: \n" + chalk.hex('#4287f5').bold('<db>.subtract(\'mykey\', 100)') + content);
      } else {
        if(!key && options.disableWarnMessage === true || !value && options.disableWarnMessage === true || isNaN(value) && options.disableWarnMessage === true) return null;
        let v = this.get(key)
        if(!v) v = 0;
        let a = new Function(`return ${v} - ${value}`)()
        this.set(key, a)
        fs.writeFileSync(path, JSON.stringify(d), 'utf8')
      }
    },
    push(key, value) {
      if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}), 'utf8');
      if(!key && options.disableWarnMessage !== true || !value && options.disableWarnMessage !== true) return console.warn(chalk.hex('#ffbf00').bold("[lol.db] ") + "Please make sure you use the right syntax for the " + chalk.hex('#eb8f34').bold("push") + " function, per example: \n" + chalk.hex('#4287f5').bold('<db>.push(\'mykey\', \'myvalue\')\n'));
      if(!key && options.disableWarnMessage === true || !value && options.disableWarnMessage === true) return null;
      let array = this.get(key)
      if(typeof array !== 'object') return undefined;
      if(!array) array = [];
      array.push(value)
      if(key.includes('.')) {
        assign(d, key, array)
      } else {
        d[key] = array
      }
      fs.writeFileSync(path, JSON.stringify(d), 'utf8')
    },
    removeFromArray(key, value) {
      if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}), 'utf8');
      if(!key && options.disableWarnMessage !== true || !value && options.disableWarnMessage !== true) return console.warn(chalk.hex('#ffbf00').bold("[lol.db] ") + "Please make sure you use the right syntax for the " + chalk.hex('#eb8f34').bold("removeFromArray") + " function, per example: \n" + chalk.hex('#4287f5').bold('<db>.removeFromArray(\'mykey\', \'myvalue\')\n'));
      if(!key && options.disableWarnMessage === true || !value && options.disableWarnMessage === true) return null;
      let array = this.get(key)
      if(typeof array !== 'object') return undefined;
      let index = array.indexOf(value)
      if(index > -1) {
        array.splice(index, 1);
      } else {
        array = [];
      }
      if(key.includes('.')) {
        assign(d, key, array)
      } else {
        d[key] = array
      }
      fs.writeFileSync(path, JSON.stringify(d), 'utf8')
    },
    clear() {
      fs.writeFileSync(path, '{}', 'utf8')
    },
    delete(key) {
      if(!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}), 'utf8');
      if(!key && options.disableWarnMessage !== true) return console.warn(chalk.hex('#ffbf00').bold("[lol.db] ") + "Please make sure you use the right syntax for the " + chalk.hex('#eb8f34').bold("delete") + " function, per example: \n" + chalk.hex('#4287f5').bold('<db>.delete(\'mykey\')\n'));
      if(!key && options.disableWarnMessage === true) return null;
      if(key.includes('.')) {
        deleteObjPath(d, key)
      } else {
        delete d[key]
      }
      fs.writeFileSync(path, JSON.stringify(d), 'utf8')
    }
  }
}
