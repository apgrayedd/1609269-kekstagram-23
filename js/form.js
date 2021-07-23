import {
  checkRepeatArr,
  findInObj,
  checkfirstSymbol,
  checkMinLength,
  checkMaxLength,
  matchValidation,
  createfunctionByKeyDown,
  createMessageAlert,
  limitationValue,
  addStyles,
  loadMessage
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

function rescaleChange (change) {
  const scalePreview = document.querySelector('.img-upload__preview');
  const scaleCount = document.querySelector('.scale__control--value');
  const rescaledCount = Number(scaleCount.value.replace('%','')) + change;
  const rescaledInFrame = limitationValue(0,100,rescaledCount);

  scaleCount.value = `${rescaledInFrame}%`;
  scalePreview.style.transform = `scale(${rescaledInFrame/100})`;
}

function checkField (fieldInput, fieldValue, hashOptions) {
  const message = checkfirstSymbol(fieldValue,hashOptions.firstSymbol) ||
                  checkMinLength(fieldValue,hashOptions.min) ||
                  checkMaxLength(fieldValue, hashOptions.max) ||
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
  commentInput.style = '';
  const commentStatus =  checkMaxLength(commentInput.value,maxLengthComment);
  if(commentStatus) {
    commentInput.setCustomValidity(commentStatus);
    commentInput.reportValidity();
    return false;
  }
  commentInput.setCustomValidity('');
  commentInput.reportValidity();
  return true;
}

function checkHashPlace (hashTextInput, hashFieldOptions) {
  hashTextInput.style = '';
  if (hashTextInput.value === '') {
    return true;
  }
  const hashList = hashTextInput.value.split(' ');
  const hashListStatus = [];
  let status = false;

  hashList.map((hashValue, hashKey) => {
    hashListStatus[hashKey] = !checkField(hashTextInput, hashValue, hashFieldOptions.hashOptions)? hashValue : false;
  });
  const toLowerHash = (hashStr) => hashStr.toLowerCase();
  if (!checkRepeatArr(hashListStatus, toLowerHash) && !hashListStatus.includes(false)) {
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

function toStandartOptions () {
  const body = document.querySelector('body');
  const formChangeFile = document.querySelector('.img-upload__overlay');
  const scaleCount = document.querySelector('.scale__control--value');
  const scalePreview = document.querySelector('.img-upload__preview');
  const sliderElement = document.querySelector('.effect-level__slider');
  const hashTextInput = document.querySelector('.text__hashtags');
  const commentInput = document.querySelector('.text__description');

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
}

function newPostCreate (rescaleChangeValue, hashFieldOptions, maxLengthComment,sliderEffectsOptions, linkServer) {
  const body = document.querySelector('body');
  const formNewPostCreate = document.querySelector('#upload-select-image');
  const formChangeFile = document.querySelector('.img-upload__overlay');
  const formChangeImg = document.querySelector('.img-upload__preview img');
  const newPostFile = document.querySelector('#upload-file');
  const scaleButtonSmaller = document.querySelector('.scale__control--smaller');
  const scaleButtonBigger = document.querySelector('.scale__control--bigger');
  const effectsList = document.querySelector('.effects__list');
  const hashTextInput = document.querySelector('.text__hashtags');
  const commentInput = document.querySelector('.text__description');
  const buttonSubmit = document.querySelector('#upload-submit');
  const closeButton = document.querySelector('#upload-cancel');
  const ESC_KEY_CODE = 27;

  function rescaleFileSmallerHandler () {
    rescaleChange(-(rescaleChangeValue));
  }

  function rescaleFileBiggerHandler () {
    rescaleChange(rescaleChangeValue);
  }

  function choiceFileEffectHandler (evt) {
    choiceFileEffect(evt, sliderEffectsOptions);
  }
  function checkHashPlaceHandler () {
    return checkHashPlace(hashTextInput, hashFieldOptions);
  }

  function checkCommentPlaceHandler () {
    return checkCommentPlace(commentInput, maxLengthComment);
  }

  const closeNewPostHandler = () => {
    scaleButtonSmaller.removeEventListener('click', rescaleFileSmallerHandler, false);
    scaleButtonBigger.removeEventListener('click', rescaleFileBiggerHandler, false);
    effectsList.removeEventListener('change', choiceFileEffectHandler, false);
    // eslint-disable-next-line no-use-before-define
    commentInput.removeEventListener('focus', removeEventCloseByEscHandler);
    // eslint-disable-next-line no-use-before-define
    commentInput.removeEventListener('blur', addEventCloseByEscHandler);
    commentInput.removeEventListener('input', checkCommentPlaceHandler, false);
    hashTextInput.removeEventListener('input', checkHashPlaceHandler, false);
    // eslint-disable-next-line no-use-before-define
    hashTextInput.removeEventListener('focus', removeEventCloseByEscHandler, false);
    // eslint-disable-next-line no-use-before-define
    hashTextInput.removeEventListener('blur', addEventCloseByEscHandler, false);
    // eslint-disable-next-line no-use-before-define
    buttonSubmit.removeEventListener('click', checkerSubmitPostHandler, false);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('keydown', closeNewPostByEscHandler, false);
    toStandartOptions();
  };
  const createErrorMessage = () =>
    createMessageAlert('error', [{
      name: 'error__button',
      function: [() => newPostFile.click()],
    }]);
  const createSuccessMessage = () => {
    createMessageAlert('success', [{name:'success__button'}]);
  };

  function checkerSubmitPostHandler (evt) {
    evt.preventDefault();
    if (!checkHashPlaceHandler()){
      addStyles(hashTextInput, {
        border: '2px solid red',
        outline: 'none',
      });
      return false;
    }

    if (!checkCommentPlaceHandler()) {
      addStyles(commentInput, {
        border: '2px solid red',
        outline: 'none',
      });
      return false;
    }
    closeNewPostHandler();
    webRequest(
      linkServer,
      [createSuccessMessage],
      [createErrorMessage],
      formNewPostCreate);
    return true;
  }

  function closeNewPostByEscHandler (evt) {
    createfunctionByKeyDown(evt, ESC_KEY_CODE, closeNewPostHandler);
  }

  function removeEventCloseByEscHandler () {
    window.removeEventListener('keydown', closeNewPostByEscHandler, false);
  }

  function addEventCloseByEscHandler () {
    window.addEventListener('keydown', closeNewPostByEscHandler, false);
  }

  function newPostCreateHandler () {
    loadMessage();
    const file = loadFile(newPostFile);
    if (file) {
      formChangeImg.src = '';
      const newFileReader = new FileReader();
      newFileReader.readAsDataURL(file);
      newFileReader.addEventListener('load', () => {
        loadMessage();
        formChangeImg.src = newFileReader.result;
        formChangeFile.classList.remove('hidden');
        body.classList.add('modal-open');
        scaleButtonSmaller.addEventListener('click', rescaleFileSmallerHandler, false);
        scaleButtonBigger.addEventListener('click', rescaleFileBiggerHandler, false);
        effectsList.addEventListener('change', choiceFileEffectHandler, false);
        commentInput.addEventListener('input', checkCommentPlaceHandler, false);
        commentInput.addEventListener('focus', removeEventCloseByEscHandler, false);
        commentInput.addEventListener('blur', addEventCloseByEscHandler, false);
        hashTextInput.addEventListener('input', checkHashPlaceHandler, false);
        hashTextInput.addEventListener('focus', removeEventCloseByEscHandler, false);
        hashTextInput.addEventListener('blur', addEventCloseByEscHandler, false);

        buttonSubmit.addEventListener('click', checkerSubmitPostHandler, false);
        closeButton.addEventListener('click', closeNewPostHandler, false);
        window.addEventListener('keydown', closeNewPostByEscHandler, false);
        formChangeFile.scrollTo(0,0);
      }, false);
    }
  }

  newPostFile.addEventListener('input', newPostCreateHandler, false);
}

export {newPostCreate};
