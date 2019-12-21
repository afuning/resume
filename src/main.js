import './main.scss';

function unique (arr) {
  return [...new Set(arr)]
}

function uniqueObject (arr) {
  
}

function uniqueObject(arr){
  let unique = {};
  arr.forEach(function(item){
    unique[JSON.stringify(item)]=item;
  })
  arr = Object.keys(unique).map(function(u){
    return JSON.parse(u);
  })
  return arr;
}

obj_1 = {
  a: 'yyy',
  b: {
    c: 4,
    d: 5
  }
}

obj_2 = {
  a: 'xxx',
  b: {
    c: 5,
    d: 6
  }
}

function getType (obj, type) {
  const types = 'Array Object String Symbol Date RegExp Function Boolean Number Null Undefined'.split(' ');
  const realType = Object.prototype.toString.call(obj).slice(8, -1);
  return type === realType;
}
function cloneRegExp(regexp) {
 const result = new regexp.constructor(regexp.source, /\w*$/.exec(regexp))
 result.lastIndex = regexp.lastIndex
 return result
}

function clone (obj, hash = new WeakMap()) {
  if (hash.has(obj)) return hash.get(obj)
  if (getType(obj, 'Function')) {
    return new Function("return " + obj.toString())();
  } else if (getType(obj, 'RegExp')) {
    return cloneRegExp();
  } else if (getType(obj, 'Date')) {
    return new Date(obj.getTime());
  } else if (getType(obj, 'Symbol')) {
    return Object(Symbol.prototype.valueOf.call(obj));
  } else if (obj === null || (typeof obj !== "object")) {
    return obj;
  } else {
    let name;
    let target = getType(obj, 'Array') ? [] : {};
    hash.set(obj, target);
    for (name in obj) {
      let value = obj[name];
      if (getType(value, 'Array') || getType(value, 'Object')) {
        target[name] = clone(value, hash);
      } else if (getType(value, 'RegExp')) {
        target[name] = cloneRegExp();
      } else if (getType(value, 'Date')) {
        target[name] = new Date(value.getTime());
      } else if (getType(value, 'Symbol')) {
        target[name] = Object(Symbol.prototype.valueOf.call(value));
      } else if (value === null || (typeof value !== "object")) {
        target[name] = value;
      }
    }
    return target
  }
}

function unique1 (arr) {
    if (arr instanceof Array && arr.length !== 0) {
        let result = [arr[0]];
        for (let i = 1; i < arr.length; i++) {
          let isSame = false;
          for (let j = 0; j < arr.length; j ++) {
             if (arr[j] === arr[i]) {
                 isSame = true;
             }
          }
          if (!isSame) result.push(arr[i]);
        }
    }
    return arr;
}

function unique (arr) {
  let result = [];
  let hash = new Map();
  arr.forEach(item => {
    if (!hash.has(JSON.stringify(item))) {
      result.push(item)
      hash.set(JSON.stringify(item), item);
    }
  })
  return result
}
