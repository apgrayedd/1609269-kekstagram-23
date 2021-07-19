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

function checkRepeatArr(arr, variableProcessing ) {
  const result = [];

  for (let str of arr) {
    if (variableProcessing && typeof(str) === 'string') {
      str = variableProcessing(str);
    }
    if (result.includes(str)) {
      return false;
    } else {
      result.push(str);
    }
  }
  return true;
}

function findInObj (obj, objKey, value, objKeyForReturn) {
  for(const elem in obj) {
    if (elem[objKey] === value){
      if (objKeyForReturn) {
        return elem[objKeyForReturn];
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


function functionByKeyDown(evt, keyCode, eventFunction) {
  if (!evt) {evt = window.event;}
  const evtKeyCode = evt.keyCode;
  if (evtKeyCode === keyCode) {
    evt.preventDefault();
    eventFunction();
  }
}

function createHTMLElement(tag, classArr, addAttributesObj, addStylesObj) {
  const newElement = document.createElement(tag);
  if (classArr) {
    classArr.forEach((classItem) => {
      newElement.classList.add(classItem);
    });
  }
  if (addAttributesObj) {
    for (const addAttributKey in addAttributesObj) {
      newElement[addAttributKey] = addAttributesObj[addAttributKey];
    }
  }
  if (addStylesObj) {
    for (const styleKey in addStylesObj) {
      newElement['style'][styleKey] = addStylesObj[styleKey];
    }
  }
  return newElement;
}

function messageAlert (templateName, buttonOptions) {
  const body = document.querySelector('body');
  const template = document.querySelector(`#${templateName}`).content.querySelector(`.${templateName}`);
  const templateHTMLElem = template.cloneNode(true);

  body.classList.add('modal-open');
  body.appendChild(templateHTMLElem);
  const closeForm = () => {
    body.classList.remove('modal-open');
    document.querySelector(`.${templateName}`).remove();
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('keydown', closeFormByEsc, false);
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('click', closeOnAnotherForm, false);
  };
  const closeFormByEsc = (evt) => {
    functionByKeyDown(evt, 27, closeForm);
  };
  const closeOnAnotherForm = (evt) => {
    if (!evt.target.classList.contains(`${templateName}__inner`)){
      closeForm();
    }
  };
  if (buttonOptions) {
    buttonOptions.forEach((buttonOption) => {
      const messageForm = document.querySelector(`.${templateName}`);
      const messageButton = messageForm.querySelector(`.${buttonOption.name}`);
      const functionOnButton = () => {
        if (buttonOption.function) {
          buttonOption.function.forEach((funct) => {
            funct(messageButton);
          });
        }
        closeForm();
        messageButton.removeEventListener('click', functionOnButton, false);
      };
      messageButton.addEventListener('click', functionOnButton, false);
    });
  }
  document.addEventListener('click', closeOnAnotherForm, false);
  window.addEventListener('keydown', closeFormByEsc, false);
}


function limitationValue(min, max, value) {
  const lowerLimit = Math.max(value, min) === min ? min : value;
  return Math.min(lowerLimit, max) === max ? max : lowerLimit;
}

export {
  checkRepeatArr,
  findInObj,
  getRandomNumber,
  mixArray,
  firstSymbol,
  minLength,
  maxLength,
  matchValidation,
  functionByKeyDown,
  createHTMLElement,
  messageAlert,
  limitationValue
};
