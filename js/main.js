import {checkCommentError, getRandomPost, mixedArray} from './data.js';
import {getRandomNumber} from './util.js';

const MAX_LENGTH_COMMENT = 10;
const NUMBER_OF_POSTS_AND_PHOTO = getRandomNumber(1,25);
const NUMBER_OF_COMMENTS = getRandomNumber(1,6);
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
const someIdComments = new Array(NUMBER_OF_COMMENTS).fill().map((elem,key) => key+=1).sort(() => 0.5 - Math.random());
const someIdPosts = mixedArray(new Array(NUMBER_OF_POSTS_AND_PHOTO).fill().map((elem,key) => key+=1));
const someIdPhotos = mixedArray(new Array(NUMBER_OF_POSTS_AND_PHOTO).fill().map((elem,key) => key+=1));
const posts = new Array(NUMBER_OF_POSTS_AND_PHOTO).fill().map((elem,key) => getRandomPost(someIdPosts[key],someIdComments,someIdPhotos[key],someComments,someNames,NUMBER_OF_COMMENTS));
checkCommentError(posts[0]['comments'][0]['message'],MAX_LENGTH_COMMENT);
