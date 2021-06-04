const MAX_LENGTH_COMMENT = 10;
const getRandomNumber = (min,max) => Math.floor(Math.random() * (Math.max(max,min) - Math.min(max,min) + 1)) + Math.min(max,min);
const checkCommentError = (comment, maxLen) => comment.length < maxLen ? comment : false;

const userComment = checkCommentError('Случайный комментарий',MAX_LENGTH_COMMENT);
const randomNumber = getRandomNumber(5,-1);

console.log(userComment);
console.log(randomNumber);
