import {
  checkRepeatArr,
  findInObj,
  firstSymbol,
  minLength,
  maxLength,
  matchValidation,
  functionByKeyDown
} from './util.js';
import {
  webRequest
} from './web.js';

function loadFile (inputFile) {
  const file = inputFile.files[0];
  if (file) {
    const newFileReader = new FileReader();
    newFileReader.readAsDataURL(file);
    return file;
  }
}

function rescaleChange (change, operator, maxChange) {
  const scalePreview = document.querySelector('.img-upload__preview');
  const scaleCount = document.querySelector('.scale__control--value');
  let scaleCountValue = Number(scaleCount.value.replace('%','')) + change;

  switch(operator) {
    case '<':
      scaleCountValue = scaleCountValue <= maxChange ? maxChange : scaleCountValue;
      break;
    case '>':
      scaleCountValue = scaleCountValue >= maxChange ? maxChange : scaleCountValue;
      break;
  }
  scaleCount.value = `${scaleCountValue}%`;
  scalePreview.style.transform = `scale(${scaleCountValue/100})`;
}

function checkField (fieldInput, fieldValue, hashOptions) {
  const message = firstSymbol(fieldValue,hashOptions.firstSymbol) ||
                  minLength(fieldValue,hashOptions.min) ||
                  maxLength(fieldValue, hashOptions.max) ||
                  matchValidation(fieldValue.slice(1));
  if (message) {
    fieldInput.setCustomValidity(message);
    fieldInput.reportValidity();
    return message;
  }
}

function choiceFileEffect (evt, sliderEffectsOptions) {
  const scalePreview = document.querySelector('.img-upload__preview');
  const sliderElement = document.querySelector('.effect-level__slider');
  const sliderInput = document.querySelector('.effect-level__value');
  const radioEffect = evt.target.value;
  const sliderStandardOption = findInObj(sliderEffectsOptions, 'effectName', 'none', 'effectSliderOption');

  scalePreview.classList = 'img-upload__preview';
  scalePreview.classList.add(`effects__preview--${radioEffect}`);
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }
  if (radioEffect === 'none') {
    scalePreview.style.filter = '';
    return 'Not have slider';
  }
  if (sliderStandardOption) {
    noUiSlider.create(sliderElement, sliderStandardOption);
  } else {
    noUiSlider.create(sliderElement, {
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      step: 1,
      connect: 'lower',
    });
  }
  if (sliderEffectsOptions) {
    sliderEffectsOptions.forEach((option) => {
      if (radioEffect === option.effectName &&
          option.effectSliderOption) {
        sliderElement.noUiSlider.updateOptions(option.effectSliderOption);
      }
    });
  }
  sliderElement.noUiSlider.on('update', (values, handle, unencoded) => {
    const radioEffectValue = unencoded[handle];
    sliderInput.value = radioEffectValue;
    scalePreview.style.filter = '';
    if (sliderEffectsOptions) {
      sliderEffectsOptions.forEach((option) => {
        if (radioEffect === option.effectName) {
          scalePreview.style.filter = option.filter(radioEffectValue);
        }
      });
    }
  });
}

function checkCommentPlace (commentInput, maxLengthComment) {
  const commentStatus =  maxLength(commentInput.value,maxLengthComment);
  if(commentStatus) {
    commentInput.setCustomValidity(commentStatus);
    commentInput.reportValidity();
    return false;
  } else {
    commentInput.setCustomValidity('');
    commentInput.reportValidity();
    return true;
  }
}

function checkHashPlace (hashTextInput, hashFieldOptions) {
  if (hashTextInput.value === '') {
    return true;
  }
  const hashList = hashTextInput.value.split(' ');
  const hashListStatus = [];
  let status = false;

  hashList.map((hashValue, hashKey) => {
    hashListStatus[hashKey] = !checkField(hashTextInput, hashValue, hashFieldOptions.hashOptions)? hashValue : false;
  });
  if (!checkRepeatArr(hashListStatus) && !hashListStatus.includes(false)) {
    hashTextInput.setCustomValidity('Хэштеги не должны повторяться');
  } else if (hashListStatus.length > hashFieldOptions.numberHash) {
    hashTextInput.setCustomValidity(`Пост не может содержать больше ${hashFieldOptions.numberHash} хэштегов`);
  } else if (!hashListStatus.includes(false)) {
    hashTextInput.setCustomValidity('');
    status = true;
  }
  hashTextInput.reportValidity();
  return status;
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

function newPostCreate (hashFieldOptions, maxLengthComment,sliderEffectsOptions, linkServer) {
  const body = document.querySelector('body');
  const formNewPostCreate = document.querySelector('#upload-select-image');
  const formChangeFile = document.querySelector('.img-upload__overlay');
  const formChangeImg = document.querySelector('.img-upload__preview img');
  const newPostFile = document.querySelector('#upload-file');
  const scalePreview = document.querySelector('.img-upload__preview');
  const scaleCount = document.querySelector('.scale__control--value');
  const scaleButtonSmaller = document.querySelector('.scale__control--smaller');
  const scaleButtonBigger = document.querySelector('.scale__control--bigger');
  const effectsList = document.querySelector('.effects__list');
  const sliderElement = document.querySelector('.effect-level__slider');
  const hashTextInput = document.querySelector('.text__hashtags');
  const commentInput = document.querySelector('.text__description');
  const buttonSubmit = document.querySelector('#upload-submit');
  const closeButton = document.querySelector('#upload-cancel');

  function loadFileFunction () {
    return loadFile(newPostFile);
  }

  function rescaleFileSmaller () {
    rescaleChange(-25,'<',0);
  }

  function rescaleFileBigger () {
    rescaleChange(25,'>',100);
  }

  function choiceFileEffectFunction (evt) {
    choiceFileEffect(evt, sliderEffectsOptions);
  }
  function checkHashPlaceFunction () {
    return checkHashPlace(hashTextInput, hashFieldOptions);
  }

  function checkCommentPlaceFunction () {
    return checkCommentPlace(commentInput, maxLengthComment);
  }

  const closeNewPost = () => {
    scaleButtonSmaller.removeEventListener('click', rescaleFileSmaller, false);
    scaleButtonBigger.removeEventListener('click', rescaleFileBigger, false);
    effectsList.removeEventListener('change', choiceFileEffectFunction, false);
    // eslint-disable-next-line no-use-before-define
    commentInput.removeEventListener('focus', removeEventCloseByEsc);
    // eslint-disable-next-line no-use-before-define
    commentInput.removeEventListener('blur', addEventCloseByEsc);
    commentInput.removeEventListener('input', checkCommentPlaceFunction, false);
    hashTextInput.removeEventListener('input', checkHashPlaceFunction, false);
    // eslint-disable-next-line no-use-before-define
    buttonSubmit.removeEventListener('input', checkerSubmitPost, false);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('keydown', closeNewPostByEsc, false);

    formChangeFile.classList.add('hidden');
    body.classList.remove('modal-open');
    scaleCount.value = '100%';
    if (sliderElement.noUiSlider) {
      sliderElement.noUiSlider.destroy();
    }
    scalePreview.style = '';
    scalePreview.classList = 'img-upload__preview';
    hashTextInput.value = '';
    commentInput.value = '';
  };
  const errorAlert = () =>
    messageAlert('error', [{
      name: 'error__button',
      function: [() => newPostFile.click()],
    }]);
  const successAlert = () => {
    messageAlert('success', [{name:'success__button'}]);
  };
  function checkerSubmitPost (evt) {
    evt.preventDefault();
    if (checkHashPlaceFunction() &&
        checkCommentPlaceFunction()){
      webRequest(
        linkServer,
        [closeNewPost, successAlert],
        [closeNewPost, errorAlert],
        formNewPostCreate);
    }
  }

  function closeNewPostByEsc (evt) {
    functionByKeyDown(evt, 27, closeNewPost);
  }

  function removeEventCloseByEsc () {
    window.removeEventListener('keydown', closeNewPostByEsc, false);
  }

  function addEventCloseByEsc () {
    window.addEventListener('keydown', closeNewPostByEsc, false);
  }

  function newPostCreateFunction () {
    const file = loadFileFunction();
    if (file) {
      const newFileReader = new FileReader();
      newFileReader.readAsDataURL(file);
      newFileReader.addEventListener('load', () => {
        formChangeFile.classList.remove('hidden');
        body.classList.add('modal-open');
        formChangeImg.src = newFileReader.result;
        scaleButtonSmaller.addEventListener('click', rescaleFileSmaller, false);
        scaleButtonBigger.addEventListener('click', rescaleFileBigger, false);
        effectsList.addEventListener('change', choiceFileEffectFunction, false);
        commentInput.addEventListener('input', checkCommentPlaceFunction, false);
        commentInput.addEventListener('focus', removeEventCloseByEsc, false);
        commentInput.addEventListener('blur', addEventCloseByEsc, false);
        hashTextInput.addEventListener('input', checkHashPlaceFunction, false);

        buttonSubmit.addEventListener('click', checkerSubmitPost, false);
        closeButton.addEventListener('click', closeNewPost, false);
        window.addEventListener('keydown', closeNewPostByEsc, false);
        formChangeFile.scrollTo(0,0);
      }, false);
    }
  }

  newPostFile.addEventListener('input', newPostCreateFunction, false);
}

export {newPostCreate};
