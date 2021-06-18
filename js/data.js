import {getRandomNumber} from './util.js';

const checkCommentError = (comment, maxLen) => comment.length < maxLen ? comment : false;
function mixedArray (array = []) {
  const mixArray = [];
  while (array.length > 0) {
    const randomElem = array.splice(getRandomNumber(0, array.length - 1), 1)[0];
    mixArray.push(randomElem);
  }
  return mixArray;
}
function getRandomComment(idComment,comments,names) {
  const linkStrAvatar = 'img/avatar-';
  const typeImgAvatar = '.svg';
  const message = comments[getRandomNumber(0,comments.length-1)];
  const message2 = message + comments[getRandomNumber(0,comments.length-1)];
  return {
    id: idComment,
    avatar: linkStrAvatar + getRandomNumber(1,6) + typeImgAvatar,
    message: Math.random() < 0.5 ? message: message2,
    name: names[getRandomNumber(0,names.length-1)],
  };
}
function getRandomPost(idPost,idComments,idPhoto,comments,names, NUMBER_OF_COMMENTS) {
  const linkStrPost = 'photos/';
  const typeImgPost = '.svg';
  return {
    id : idPost,
    url : linkStrPost + idPhoto + typeImgPost,
    description : 'Случайное описание',
    likes : getRandomNumber(15,200),
    comments : new Array(NUMBER_OF_COMMENTS).fill().map((elem,key) => getRandomComment(idComments[key],comments,names)),
  };
}
export {checkCommentError, getRandomPost, getRandomComment, mixedArray};
