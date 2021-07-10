import './util.js';
import {addPost} from './picture.js';
import {loadFile} from './form.js';

const MAX_COMMENTS_POST = 5;
const MAX_LENGTH_COMMENT = 140;
const avatarPostOptions = {
  height: '35',
  width: '35',
};
const hashFieldOptions = {
  hashOptions: {
    firstSymbol: '#',
    min: 2,
    max: 20,
  },
  numberHash: 5,
};

const effectsOptions = [
  {
    effectName : 'none',
    effectSliderOption : {range: {min: 0,max: 100},start: 100, step: 1, connect: 'lower'},
  },
  {
    effectName : 'chrome',
    filter: (value) => `grayscale(${value/100})`,
  },
  {
    effectName : 'sepia',
    filter: (value) => `sepia(${value/100})`,
  },
  {
    effectName : 'marvin',
    filter: (value) => `invert(${value}%)`,
  },
  {
    effectName : 'phobos',
    effectSliderOption : {range: {min: 0,max: 30},start: 30},
    filter: (value) => `blur(${value/10}px)`,
  },
  {
    effectName : 'heat',
    effectSliderOption : {range: {min: 0,max: 20},start: 20},
    filter: (value) => `brightness(${value/10 + 1})`,
  },
];

fetch('https://23.javascript.pages.academy/kekstagram/data')
  .then((json) => json.json())
  .then((data) => addPost(data, avatarPostOptions, MAX_COMMENTS_POST));
loadFile(hashFieldOptions, MAX_LENGTH_COMMENT,effectsOptions);

