const MAX_LENGTH_COMMENT = 10;
const getRandomNumber = (min,max) => Math.floor(Math.random() * (Math.max(max,min) - Math.min(max,min) + 1)) + Math.min(max,min);
const NUMBER_OF_POSTS = getRandomNumber(1,25);
const NUMBER_OF_COMMENT = getRandomNumber(1,100);

const checkCommentError = (comment, maxLen) => comment.length < maxLen ? comment : false;
const comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];
function mixedArray (array = []) {
  const mixArray = [];
  while (array.length > 0) {
    const randomElem = array.splice(getRandomNumber(0, array.length - 1), 1)[0];
    mixArray.push(randomElem);
  }
  return mixArray;
}
function getRandomComment(idComment) {
  const linkStrAvatar = 'img/avatar-';
  const typeImgAvatar = '.svg';
  return {
    id: idComment,
    avatar: linkStrAvatar + getRandomNumber(1,6) + typeImgAvatar,
    message: comments[getRandomNumber(0,comments.length-1)],
    name: 'Артём',
  };
}
function getRandomPost(idPost,idComments) {
  const linkStrPost = 'photos/';
  const typeImgPost = '.svg';
  return {
    id : idPost,
    url : linkStrPost + getRandomNumber(1,25) + typeImgPost,
    description : 'Случайное описание',
    likes : getRandomNumber(15,200),
    comments : new Array(NUMBER_OF_COMMENT).fill().map((elem,key) => getRandomComment(idComments[key++])),
  };
}

const someIdComments = new Array(NUMBER_OF_COMMENT).fill().map((elem,key) => key+=1).sort(() => 0.5 - Math.random());
const someIdPosts = mixedArray(new Array(NUMBER_OF_POSTS).fill().map((elem,key) => key+=1));
const posts = new Array(NUMBER_OF_POSTS).fill().map((elem,key) => getRandomPost(someIdPosts[key++],someIdComments,comments));
checkCommentError(posts[0]['comments'][0]['message'],MAX_LENGTH_COMMENT);
