const getRandomNumber = (min,max) => Math.floor(Math.random() * (Math.max(max,min) - Math.min(max,min) + 1)) + Math.min(max,min);
function mixArray (items = []) {
  const array = [...items];
  const mixedArray = [];
  while (array.length > 0) {
    const randomElem = array.splice(getRandomNumber(0, array.length - 1), 1)[0];
    mixedArray.push(randomElem);
  }
  return mixedArray;
}

function checkRepeatArr(arr) {
  const result = [];

  for (const str of arr) {
    if (result.includes(str)) {
      return false;
    } else {
      result.push(str);
    }
  }
  return true;
}

function findInObj (obj, objKey, value, objKeyForReturn) {
  for(let elem = 0; elem < obj.length; elem++) {
    if (obj[elem][objKey] === value){
      if (objKeyForReturn) {
        return obj[elem][objKeyForReturn];
      } else {
        return true;
      }
    }
  }
}
function firstSymbol (fieldValue,firstSymbolValue) {
  if (fieldValue[0] !== firstSymbolValue) {
    return `Первым знаком поля должен быть знак "${firstSymbolValue}"`;
  }
}


function minLength (fieldValue, MIN_LENGTH_FIELD) {
  if (fieldValue.length < MIN_LENGTH_FIELD) {
    return `Поле должен состоять хотя бы из ${MIN_LENGTH_FIELD}х символов`;
  }
}

function maxLength (fieldValue, MAX_LENGTH_FIELD) {
  if (fieldValue.length > MAX_LENGTH_FIELD) {
    return `Поле должен состоять не больше ${MAX_LENGTH_FIELD} символов`;
  }
}

function matchValidation (fieldValue) {
  const match = fieldValue.match(/[a-zA-Zа-юА-Ю0-9]*/);

  if (!match) {
    return 'Хэш должен быть типа #ХэшТэг и не содержать #, @, $ и т. п.';
  }
  const result = match[0] === match['input'] ? fieldValue : false;
  if (!result) {
    return 'Хэш должен быть типа #ХэшТэг и не содержать #, @, $ и т. п.';
  }
}
export {
  checkRepeatArr,
  findInObj,
  getRandomNumber,
  mixArray,
  firstSymbol,
  minLength,
  maxLength,
  matchValidation
};
