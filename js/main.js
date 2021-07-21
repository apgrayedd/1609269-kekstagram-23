import './util.js';
import {postsFilter} from './filter.js';
import {webRequest} from './web.js';
import {addPost, addPostError} from './picture.js';
import {newPostCreate} from './form.js';

const RESCALE_CHANGE_VALUE = 25;
const MAX_NUMBER_FOR_RANDOM_FILTER = 10;
const RERENDER_DELAY = 100;
const MAX_COMMENTS_POST = 5;
const MAX_LENGTH_COMMENT = 140;
const LINK_SERVER_POST = 'https://23.javascript.pages.academy/kekstagram';
const LINK_SERVER_GET = 'https://23.javascript.pages.academy/kekstagram/data';
const CONSTANT_SLIDER_OPTIONS = {range: {min: 0,max: 100},start: 100, step: 1, connect: 'lower'};
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
    effectSliderOption : CONSTANT_SLIDER_OPTIONS,
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

const addPostsFunction = (dataPosts) => addPost(dataPosts, avatarPostOptions, MAX_COMMENTS_POST);
webRequest(LINK_SERVER_GET, [addPostsFunction], [addPostError]).then((result) => {
  const addPostWithDebounce = _.debounce(addPostsFunction,RERENDER_DELAY);
  postsFilter(result, addPostWithDebounce, MAX_NUMBER_FOR_RANDOM_FILTER);
});
newPostCreate(RESCALE_CHANGE_VALUE, hashFieldOptions, MAX_LENGTH_COMMENT,effectsOptions, LINK_SERVER_POST);
