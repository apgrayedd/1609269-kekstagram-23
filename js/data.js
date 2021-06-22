import {getRandomNumber,mixArray} from './util.js';

function getRandomComment(idComment,comments,names, NUMBER_OF_COMMENTS) {
  const linkStrAvatar = 'img/avatar-';
  const typeImgAvatar = '.svg';
  const message = comments[getRandomNumber(0,comments.length - 1)];
  const message2 = message + comments[getRandomNumber(0,comments.length - 1)];
  return {
    id: idComment,
    avatar: linkStrAvatar + NUMBER_OF_COMMENTS + typeImgAvatar,
    message: Math.random() < 0.5 ? message: message2,
    name: names[getRandomNumber(0,names.length - 1)],
  };
}

function getRandomPost(idPost,idPhoto,comments,names,likes, MAX_OF_COMMENTS) {
  const NUMBER_OF_COMMENTS = getRandomNumber(1,MAX_OF_COMMENTS);
  const linkStrPost = 'photos/';
  const typeImgPost = '.jpg';
  const someIdComments = mixArray(new Array(NUMBER_OF_COMMENTS).fill().map((elem,key) => key+= 1));
  return {
    id : idPost,
    url : linkStrPost + idPhoto + typeImgPost,
    description : 'Случайное описание',
    likes : getRandomNumber(likes.min,likes.max),
    comments : new Array(NUMBER_OF_COMMENTS).fill().map((elem,key) => getRandomComment(someIdComments[key],comments,names,NUMBER_OF_COMMENTS)),
  };
}

export {getRandomPost, getRandomComment};
