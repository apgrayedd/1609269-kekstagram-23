const MAX_LENGTH_COMMENT = 10;
const getRandomNumber = (min,max) => Math.floor(Math.random() * (Math.max(max,min) - Math.min(max,min) + 1)) + Math.min(max,min);
const NUMBER_OF_POSTS_AND_PHOTO = getRandomNumber(1,25);
const NUMBER_OF_COMMENTS = getRandomNumber(1,6);

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
  return {
    id: idComment,
    avatar: linkStrAvatar + getRandomNumber(1,6) + typeImgAvatar,
    message: Math.random > 0.5 ? comments[getRandomNumber(0,comments.length-1)] : comments[getRandomNumber(0,comments.length-1)],
    name: names[getRandomNumber(0,names.length-1)],
  };
}
function getRandomPost(idPost,idComments,idPhoto,comments,names) {
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
const posts = new Array(NUMBER_OF_POSTS_AND_PHOTO).fill().map((elem,key) => getRandomPost(someIdPosts[key],someIdComments,someIdPhotos[key],someComments,someNames));
console.log(posts)
checkCommentError(posts[0]['comments'][0]['message'],MAX_LENGTH_COMMENT);
