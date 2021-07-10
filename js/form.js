import {
  checkRepeatArr,
  findInObj,
  firstSymbol,
  minLength,
  maxLength,
  matchValidation
} from './util.js';

function rescaleFileBigger () {
  const scalePreview = document.querySelector('.img-upload__preview');
  const scaleCount = document.querySelector('.scale__control--value');
  const scaleCountValue = Number(scaleCount.value.replace('%','')) + 25;

  scaleCount.value = scaleCountValue >= 100 ? '100%' : `${scaleCountValue}%`;
  scalePreview.style = `transform: scale(${(scaleCount.value.replace('%',''))/100})`;
}

function rescaleFileSmaller () {
  const scalePreview = document.querySelector('.img-upload__preview');
  const scaleCount = document.querySelector('.scale__control--value');
  const scaleCountValue = Number(scaleCount.value.replace('%','')) - 25;

  scaleCount.value = scaleCountValue <= 0 ? '0%' : `${scaleCountValue}%`;
  scalePreview.style = `transform: scale(${(scaleCount.value.replace('%',''))/100})`;
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
  const sliderStandartOption = findInObj(sliderEffectsOptions, 'effectName', 'none', 'effectSliderOption');

  scalePreview.classList = 'img-upload__preview';
  scalePreview.classList.add(`effects__preview--${radioEffect}`);
  if (sliderElement.noUiSlider) {
    sliderElement.noUiSlider.destroy();
  }

  if (sliderStandartOption) {
    noUiSlider.create(sliderElement, sliderStandartOption);
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
          radioEffect !== 'none' &&
          option.effectSliderOption) {
        sliderElement.noUiSlider.updateOptions(option.effectSliderOption);
      }
    });
  }
  sliderElement.noUiSlider.on('update', (values, handle, unencoded) => {
    const radioEffectValue = unencoded[handle];
    sliderInput.value = radioEffectValue;
    scalePreview.style.filter = '';
    if (radioEffect === 'none') {
      sliderElement.noUiSlider.destroy();
    } else if (sliderEffectsOptions) {
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

function loadFile (hashFieldOptions, maxLengthComment,sliderEffectsOptions) {
  const body = document.querySelector('body');
  const formChangeFile = document.querySelector('.img-upload__overlay');
  const formChangeImg = document.querySelector('.img-upload__preview img');
  const newPostFile = document.querySelector('#upload-file');
  const scalePreview = document.querySelector('.img-upload__preview');
  const scaleButtonSmaller = document.querySelector('.scale__control--smaller');
  const scaleButtonBigger = document.querySelector('.scale__control--bigger');
  const effectsList = document.querySelector('.effects__list');
  const hashTextInput = document.querySelector('.text__hashtags');
  const commentInput = document.querySelector('.text__description');
  const buttonSubmit = document.querySelector('#upload-submit');
  const closeButton = document.querySelector('#upload-cancel');

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
    formChangeFile.classList.add('hidden');
    body.classList.remove('modal-open');
    scalePreview.style = '';
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
  };

  function checkerSubmitPost (evt) {
    const newPostForm = document.querySelector('.img-upload__form');

    evt.preventDefault();
    if (checkHashPlaceFunction() && checkCommentPlaceFunction()) {
      closeNewPost();
      newPostForm.submit();
    }
  }

  function closeNewPostByEsc (event) {
    if (!event) {event = window.event;}
    const keyCode = event.keyCode;
    if (keyCode === 27) {
      event.preventDefault();
      closeNewPost();
    }
  }

  function removeEventCloseByEsc () {
    window.removeEventListener('keydown', closeNewPostByEsc, false);
  }

  function addEventCloseByEsc () {
    window.addEventListener('keydown', closeNewPostByEsc, false);
  }

  function loadFileFunction () {
    if (this.files[0]) {
      const newFileReader = new FileReader();
      newFileReader.readAsDataURL(this.files[0]);
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
      }, false);
    }
  }

  newPostFile.addEventListener('input', loadFileFunction, false);
}

export {loadFile};
