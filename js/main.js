import {getRandomPost} from './data.js';
import {getRandomNumber, mixArray} from './util.js';
import {addPost} from './picture.js';
import {loadFile} from './form.js';

const NUMBER_OF_POSTS_AND_PHOTO = getRandomNumber(1,25);
const MAX_OF_COMMENTS = 6;
const MAX_COMMENTS = 2;
const MAX_LENGTH_COMMENT = 140;

const likes = {
  min: 15,
  max: 200,
};
const someComments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];
const someNames = [
  'Артем','Владимир','Александр','Виталик','Алексей','Дмитрий',
];
const someIdPosts = mixArray(new Array(NUMBER_OF_POSTS_AND_PHOTO).fill().map((elem,key) => key + 1));
const someIdPhotos = mixArray(new Array(NUMBER_OF_POSTS_AND_PHOTO).fill().map((elem,key) => key + 1));
const posts = new Array(NUMBER_OF_POSTS_AND_PHOTO).fill().map((elem,key) => getRandomPost(someIdPosts[key],someIdPhotos[key],someComments,someNames,likes,MAX_OF_COMMENTS));
addPost(posts,MAX_COMMENTS);

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
loadFile(hashFieldOptions, MAX_LENGTH_COMMENT,effectsOptions);
