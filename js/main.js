const getRandomNumber = (min,max) => {
  if (isNaN(min) || isNaN(max)) {
    return "Неверное значение в переменных";
  }
  return Math.floor(Math.random() * (Math.max(max,min) - Math.min(max,min) + 1)) + Math.min(max,min);
};
const checkCommentError = (comment, maxLen) => {
  return String(comment).length < maxLen ? String(comment) : true;
};
const MAX_LENGTH_COMMENT = 10;
let randomNumber;
let comment = "Случайный комментарий";

comment = checkCommentError(comment,MAX_LENGTH_COMMENT);
randomNumber = getRandomNumber(-5,2);
console.log(randomNumber);
console.log(comment);
