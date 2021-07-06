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

function choiceFileEffect (evt) {
  const sliderElement = document.querySelector('.effect-level__slider');
  const sliderInput = document.querySelector('.effect-level__value');
  const scalePreview = document.querySelector('.img-upload__preview');
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

  switch(radioEffect) {
    case 'phobos':
      sliderElement.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 30,
        },
        start: 30,
      });
      break;
    case 'heat':
      sliderElement.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 20,
        },
        start: 20,
      });
      break;
  }

  sliderElement.noUiSlider.on('update', (values, handle, unencoded) => {
    const radioEffectValue = unencoded[handle];
    sliderInput.value = radioEffectValue;
    switch (radioEffect) {
      case 'none':
        if (sliderElement.noUiSlider) {
          scalePreview.style.filter = '';
          sliderElement.noUiSlider.destroy();
        }
        break;
      case 'chrome':
        scalePreview.style.filter = `grayscale(${radioEffectValue/100})`;
        break;
      case 'sepia':
        scalePreview.style.filter = `sepia(${radioEffectValue/100})`;
        break;
      case 'marvin':
        scalePreview.style.filter = `invert(${radioEffectValue}%)`;
        break;
      case 'phobos':
        scalePreview.style.filter = `blur(${radioEffectValue/10}px)`;
        break;
      case 'heat':
        scalePreview.style.filter = `brightness(${radioEffectValue/10 + 1})`;
        break;
    }
  });
}

function checkField (fieldValue, fieldInput, MIN_LENGTH_FIELD, MAX_LENGTH_FIELD) {
  const match = fieldValue.match(/^#[a-zA-Zа-юА-Ю0-9]{1,19}/);

  if (fieldValue[0] === '#') {
    if (fieldValue.length < MIN_LENGTH_FIELD) {
      fieldInput.setCustomValidity('Хэш должен состоять хотя бы из 2х символов');
    } else if (fieldValue.length > MAX_LENGTH_FIELD){
      fieldInput.setCustomValidity('Хэш должен состоять не больше 20 символов');
    } else if (match) {
      const result = match[0] === match['input'] ? fieldValue : false;
      if (result) {
        return fieldValue;
      } else {
        fieldInput.setCustomValidity('Хэш должен быть типа #ХэшТэг и не содержать #, @, $ и т. п.');
      }
    } else {
      fieldInput.setCustomValidity('Хэш должен быть типа #ХэшТэг и не содержать #, @, $ и т. п.');
    }
  } else {
    fieldInput.setCustomValidity('Первым занком хэштега должен быть знак решетки "#"');
  }
  return false;
}

function loadFile (MIN_LENGTH_HASH = 2,MAX_LENGTH_HASH = 20,MAX_NUMBER_HASH = 5, MAX_LENGTH_COMMENT = 140) {
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

  function checkHashPlace () {
    const hashList = hashTextInput.value.split(' ');
    const hashListStatus = [];
    let status = false;

    if (hashList.length === 1 || hashList[0] === '') {
      status = true;
    }
    for(let elem = 0; elem < hashList.length; elem++) {
      hashListStatus[elem] = checkField(hashList[elem],hashTextInput, MIN_LENGTH_HASH, MAX_LENGTH_HASH);
    }
    if (!unique(hashListStatus)) {
      hashTextInput.setCustomValidity('Хэштеги не должны повторяться');
    } else if (hashListStatus.length > MAX_NUMBER_HASH) {
      hashTextInput.setCustomValidity('Пост не может содержать больше 5 хэштегов');
    } else if (hashListStatus.includes(false) === false) {
      hashTextInput.setCustomValidity('');
      status = true;
    }
    hashTextInput.reportValidity();

    return status;
  }

  function checkCommentPlace () {
    let status;

    if (commentInput.value.length > MAX_LENGTH_COMMENT) {
      commentInput.setCustomValidity('Комментраий может быть не больше 140 символов');
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
    commentInput.removeEventListener('mouseover', removeEventCloseByEsc);
    // eslint-disable-next-line no-use-before-define
    commentInput.removeEventListener('mouseout', addEventCloseByEsc);
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
