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
  const scalePreview = document.querySelector('.img-upload__preview');
  const radioEffect = evt.target.value;

  scalePreview.classList = 'img-upload__preview';
  scalePreview.classList.add(`effects__preview--${radioEffect}`);
}

function fieldValidation () {
  const hashTextInput = document.querySelector('.text__hashtags');
  const hashList = hashTextInput.value.split(' ');
  const hashListStatus = [];
  let status = false;

  if (hashList.length === 1 || hashList[0] === '') {
    status = true;
  }

  for(let elem = 0; elem < hashList.length; elem++) {
    const hashText = hashList[elem];
    hashListStatus[elem] = false;
    const match = hashText.match(/^#[a-zA-Zа-юА-Ю0-9]{1,19}/);

    if (hashText[0] === '#') {
      if (hashText.length < 2) {
        hashTextInput.setCustomValidity('Хэш должен состоять хотя бы из 2х символов');
      } else if (hashText.length > 20){
        hashTextInput.setCustomValidity('Хэш должен состоять не больше 20 символов');
      } else if (match) {
        const result = match[0] === match['input'] ? hashText : false;
        if (result) {
          hashListStatus[elem] = hashText;
        } else {
          hashTextInput.setCustomValidity('Хэш должен быть типа #ХэшТэг и не содержать #, @, $ и т. п.');
        }
      } else {
        hashTextInput.setCustomValidity('Хэш должен быть типа #ХэшТэг и не содержать #, @, $ и т. п.');
      }
    } else {
      hashTextInput.setCustomValidity('Первым занком хэштега должен быть знак решетки "#"');
    }
  }
  if (!unique(hashListStatus)) {
    hashTextInput.setCustomValidity('Хэштеги не должны повторяться');
  } else if (hashListStatus.length > 5) {
    hashTextInput.setCustomValidity('Пост не может содержать больше 5 хэштегов');
  } else if (hashListStatus.includes(false) === false) {
    hashTextInput.setCustomValidity('');
    status = true;
  }
  hashTextInput.reportValidity();

  return status;
}

function loadFile () {
  const formChangeFile = document.querySelector('.img-upload__overlay');
  const formChangeImg = document.querySelector('.img-upload__preview img');
  const newPostFile = document.querySelector('#upload-file');
  const scaleButtonSmaller = document.querySelector('.scale__control--smaller');
  const scaleButtonBigger = document.querySelector('.scale__control--bigger');
  const effectsList = document.querySelector('.effects__list');
  const hashTextInput = document.querySelector('.text__hashtags');
  const buttonSubmit = document.querySelector('#upload-submit');
  const closeButton = document.querySelector('#upload-cancel');

  const closeNewPost = () => {
    formChangeFile.classList.add('hidden');
    scaleButtonSmaller.removeEventListener('click', rescaleFileSmaller, false);
    scaleButtonBigger.removeEventListener('click', rescaleFileBigger, false);
    effectsList.removeEventListener('change', choiceFileEffect, false);
    hashTextInput.removeEventListener('input', fieldValidation, false);
    // eslint-disable-next-line no-use-before-define
    buttonSubmit.removeEventListener('input', checkerSubmitPost, false);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('keydown', closeNewPostByEsc, false);
  };

  function checkerSubmitPost (evt) {
    const newPostForm = document.querySelector('.img-upload__form');

    evt.preventDefault();
    if (fieldValidation()) {
      closeNewPost();
      newPostForm.submit();
    }
  }

  function closeNewPostByEsc (event) {
    if (!event) {event = window.event;}
    const keyCode = event.keyCode;
    if (keyCode === 27) {
      closeNewPost();
    }
  }

  function loadFileFunction () {
    if (this.files[0]) {
      const newFileReader = new FileReader();
      newFileReader.readAsDataURL(this.files[0]);
      newFileReader.addEventListener('load', () => {
        formChangeFile.classList.remove('hidden');
        formChangeImg.src = newFileReader.result;

        newPostFile.addEventListener('change', loadFileFunction, false);
        scaleButtonSmaller.addEventListener('click', rescaleFileSmaller, false);
        scaleButtonBigger.addEventListener('click', rescaleFileBigger, false);
        effectsList.addEventListener('change', choiceFileEffect, false);
        hashTextInput.addEventListener('input', fieldValidation, false);
        buttonSubmit.addEventListener('click', checkerSubmitPost, false);
        closeButton.addEventListener('click', closeNewPost, false);
        window.addEventListener('keydown', closeNewPostByEsc, false);
      }, false);
    }
  }

  newPostFile.addEventListener('input', loadFileFunction, false);
}

export {loadFile};