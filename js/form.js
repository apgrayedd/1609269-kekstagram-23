import {
  checkRepeatArr,
  findInObj,
  firstSymbol,
  minLength,
  maxLength,
  matchValidation,
  functionByKeyDown,
  messageAlert,
  limitationValue
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
  const scaleCountValue = limitationValue(0,100,Number(scaleCount.value.replace('%','')) + change);

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
  commentInput.style = '';
  const commentStatus =  maxLength(commentInput.value,maxLengthComment);
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
    rescaleChange(-25);
  }

  function rescaleFileBigger () {
    rescaleChange(25);
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
    hashTextInput.removeEventListener('focus', removeEventCloseByEsc, false);
    // eslint-disable-next-line no-use-before-define
    hashTextInput.removeEventListener('blur', addEventCloseByEsc, false);
    // eslint-disable-next-line no-use-before-define
    buttonSubmit.removeEventListener('click', checkerSubmitPost, false);
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
    if (!checkHashPlaceFunction()){
      hashTextInput.style.border = '2px solid red';
      hashTextInput.style.outline = 'none';
      return false;
    }
    if (!checkCommentPlaceFunction()) {
      commentInput.style.border = '2px solid red';
      commentInput.style.outline = 'none';
      return false;
    }
    webRequest(
      linkServer,
      [closeNewPost, successAlert],
      [closeNewPost, errorAlert],
      formNewPostCreate);
    return true;
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
        hashTextInput.addEventListener('focus', removeEventCloseByEsc, false);
        hashTextInput.addEventListener('blur', addEventCloseByEsc, false);

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
