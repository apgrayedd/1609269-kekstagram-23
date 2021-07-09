import {unique} from './util.js';

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

function firstSymbol (fieldValue,firstSymbolValue) {
  if (fieldValue[0] !== firstSymbolValue) {
    return `Первым занком хэштега должен быть знак решетки "${firstSymbolValue}"`;
  }
}

function minLength (fieldValue, MIN_LENGTH_FIELD) {
  if (fieldValue.length < MIN_LENGTH_FIELD) {
    return `Хэш должен состоять хотя бы из ${MIN_LENGTH_FIELD}х символов`;
  }
}

function maxLength (fieldValue, MAX_LENGTH_FIELD) {
  if (fieldValue.length > MAX_LENGTH_FIELD) {
    return `Хэш должен состоять не больше ${MAX_LENGTH_FIELD} символов`;
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

  function choiceFileEffect (evt) {
    const sliderElement = document.querySelector('.effect-level__slider');
    const sliderInput = document.querySelector('.effect-level__value');
    const radioEffect = evt.target.value;

    scalePreview.classList = 'img-upload__preview';
    scalePreview.classList.add(`effects__preview--${radioEffect}`);
    if (sliderElement.noUiSlider) {
      sliderElement.noUiSlider.destroy();
    }
    noUiSlider.create(sliderElement, {
      range: {
        min: 0,
        max: 100,
      },
      start: 100,
      step: 1,
      connect: 'lower',
    });
    if (sliderEffectsOptions) {
      sliderEffectsOptions.forEach((option) => {
        if (radioEffect === option.effectName && option.effectSliderOption) {
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
      }
      if (sliderEffectsOptions) {
        sliderEffectsOptions.forEach((option) => {
          if (radioEffect === option.effectName) {
            scalePreview.style.filter = option.filter(radioEffectValue);
          }
        });
      }
    });
  }

  function checkHashPlace () {
    const hashList = hashTextInput.value.split(' ');
    const hashListStatus = [];
    let status = false;

    if (!hashList || hashList[0] === '') {
      status = true;
    }
    hashList.map((hashValue, hashKey) => {
      hashListStatus[hashKey] = !checkField(hashTextInput, hashValue, hashFieldOptions.hashOptions)? hashValue : false;
    });
    if (!unique(hashListStatus) && !hashListStatus.includes(false)) {
      hashTextInput.setCustomValidity('Хэштеги не должны повторяться');
    } else if (hashListStatus.length > hashFieldOptions.numberHash) {
      hashTextInput.setCustomValidity('Пост не может содержать больше 5 хэштегов');
    } else if (!hashListStatus.includes(false)) {
      hashTextInput.setCustomValidity('');
      status = true;
    }
    hashTextInput.reportValidity();

    return status;
  }

  function checkCommentPlace () {
    let status;

    if (commentInput.value.length > maxLengthComment) {
      commentInput.setCustomValidity(`Комментраий может быть не больше ${maxLengthComment} символов`);
      status = false;
    } else {
      commentInput.setCustomValidity('');
      status = true;
    }
    commentInput.reportValidity();

    return status;
  }

  const closeNewPost = () => {
    formChangeFile.classList.add('hidden');
    body.classList.remove('modal-open');
    scalePreview.style = '';
    scaleButtonSmaller.removeEventListener('click', rescaleFileSmaller, false);
    scaleButtonBigger.removeEventListener('click', rescaleFileBigger, false);
    effectsList.removeEventListener('change', choiceFileEffect, false);
    // eslint-disable-next-line no-use-before-define
    commentInput.removeEventListener('focus', removeEventCloseByEsc);
    // eslint-disable-next-line no-use-before-define
    commentInput.removeEventListener('blur', addEventCloseByEsc);
    commentInput.removeEventListener('input', checkCommentPlace, false);
    hashTextInput.removeEventListener('input', checkHashPlace, false);

    // eslint-disable-next-line no-use-before-define
    buttonSubmit.removeEventListener('input', checkerSubmitPost, false);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('keydown', closeNewPostByEsc, false);
  };

  function checkerSubmitPost (evt) {
    const newPostForm = document.querySelector('.img-upload__form');

    evt.preventDefault();
    if (checkHashPlace() && checkCommentPlace()) {
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
        effectsList.addEventListener('change', choiceFileEffect, false);
        commentInput.addEventListener('input', checkCommentPlace, false);
        commentInput.addEventListener('focus', removeEventCloseByEsc, false);
        commentInput.addEventListener('blur', addEventCloseByEsc, false);
        hashTextInput.addEventListener('input', checkHashPlace, false);

        buttonSubmit.addEventListener('click', checkerSubmitPost, false);
        closeButton.addEventListener('click', closeNewPost, false);
        window.addEventListener('keydown', closeNewPostByEsc, false);
      }, false);
    }
  }

  newPostFile.addEventListener('input', loadFileFunction, false);
}

export {loadFile};
