import {getRandomPost} from './data.js';
import {getRandomNumber, checkCommentError, mixArray} from './util.js';

const MAX_LENGTH_COMMENT = 10;
const MAX_OF_POSTS_AND_PHOTO = 25;
const MAX_OF_COMMENTS = 6;
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
const someIdComments = mixArray(new Array(getRandomNumber(1,MAX_OF_COMMENTS)).fill().map((elem,key) => key+= 1));
const someIdPosts = mixArray(new Array(getRandomNumber(1,MAX_OF_POSTS_AND_PHOTO)).fill().map((elem,key) => key+= 1));
const someIdPhotos = mixArray(new Array(getRandomNumber(1,MAX_OF_POSTS_AND_PHOTO)).fill().map((elem,key) => key+= 1));
const posts = new Array(getRandomNumber(1,MAX_OF_COMMENTS)).fill().map((elem,key) => getRandomPost(someIdPosts[key],someIdComments,someIdPhotos[key],someComments,someNames,likes,MAX_OF_COMMENTS));
checkCommentError(posts[0]['comments'][0]['message'],MAX_LENGTH_COMMENT);
