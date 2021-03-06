const getRandomNumber = (min, max) => Math.floor(Math.random() * (Math.max(max, min) - Math.min(max, min) + 1)) + Math.min(max, min);

function mixArray(items = []) {
  const array = [...items];
  const mixedArray = [];
  while (array.length > 0) {
    const randomElem = array.splice(getRandomNumber(0, array.length - 1), 1)[0];
    mixedArray.push(randomElem);
  }
  return mixedArray;
}

function checkRepeatArr(arr, variableProcessing) {
  const arrValues = [];

  for (let str of arr) {
    if (variableProcessing && typeof(str) === 'string') {
      str = variableProcessing(str);
    }

    if (arrValues.includes(str)) {
      return false;
    } else {
      arrValues.push(str);
    }
  }
  return true;
}

function findInObj(obj, objKey, value, objKeyForReturn) {
  for (const elem in obj) {
    if (elem[objKey] === value) {
      if (objKeyForReturn) {
        return elem[objKeyForReturn];
      }
      return true;
    }
  }
}

function checkFirstSymbol(fieldValue, firstSymbolValue) {
  if (fieldValue[0] !== firstSymbolValue) {
    return `Первым знаком поля должен быть знак "${firstSymbolValue}"`;
  }
}


function checkMinLength(fieldValue, MIN_LENGTH_FIELD) {
  if (fieldValue.length < MIN_LENGTH_FIELD) {
    return `Поле должен состоять хотя бы из ${MIN_LENGTH_FIELD}х символов`;
  }
}

function checkMaxLength(fieldValue, MAX_LENGTH_FIELD) {
  if (fieldValue.length > MAX_LENGTH_FIELD) {
    return `Поле должен состоять не больше ${MAX_LENGTH_FIELD} символов`;
  }
}

function matchValidation(fieldValue) {
  const match = fieldValue.match(/[a-zA-Zа-юА-Ю0-9]*/);

  if (!match) {
    return 'Поле не должно содержать #, @, $ и т. п.';
  }

  const result = match[0] === match['input'] ? fieldValue : false;
  if (!result) {
    return 'Поле не должно содержать #, @, $ и т. п.';
  }
}


function createFunctionByKeyDown(evt, keyCode, eventFunction) {
  if (!evt) { evt = window.event; }
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
    for (const addAttributeKey in addAttributesObj) {
      newElement[addAttributeKey] = addAttributesObj[addAttributeKey];
    }
  }

  if (addStylesObj) {
    for (const styleKey in addStylesObj) {
      newElement['style'][styleKey] = addStylesObj[styleKey];
    }
  }
  return newElement;
}

function addStyles(HTMLElement, stylesObj) {
  for (const style in stylesObj) {
    HTMLElement['style'][style] = stylesObj[style];
  }
}

function createMessageAlert(templateName, buttonOptions) {
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
    createFunctionByKeyDown(evt, 27, closeForm);
  };
  const closeOnAnotherForm = (evt) => {
    if (!evt.target.classList.contains(`${templateName}__inner`)) {
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

function loadMessage() {
  const body = document.querySelector('body');
  const messageInBody = document.querySelector('.img-upload__message--loading');
  if (messageInBody) {
    if (messageInBody.classList.contains('hidden')) {
      messageInBody.classList.remove('hidden');
      body.classList.add('modal-open');
    } else {
      messageInBody.classList.add('hidden');
      body.classList.remove('modal-open');
    }
    return messageInBody;
  }
  const messageTemplate = document.querySelector('#messages').content;
  const message = messageTemplate.querySelector('.img-upload__message');
  body.appendChild(message);
  return document.querySelector('.img-upload__message--loading');
}

function limitationValue(min, max, value) {
  return Math.min(Math.max(value, min), max);
}

export {
  checkRepeatArr,
  findInObj,
  getRandomNumber,
  mixArray,
  checkFirstSymbol,
  checkMinLength,
  checkMaxLength,
  matchValidation,
  createFunctionByKeyDown,
  createHTMLElement,
  createMessageAlert,
  limitationValue,
  addStyles,
  loadMessage
};
