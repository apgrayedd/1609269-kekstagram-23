const getRandomNumber = (min,max) => {
  if (isNaN(min) || isNaN(max)) {
    return "Неверное значение в переменных";
  }
  if (max < min) {
    return Math.floor(Math.random() * (min - max + 1)) + max;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const checkCommentError = (comment, maxLen) => {
  return String(comment).length < maxLen ? String(comment) : true;
};
const MAX_LENGTH_COMMENT = 10;
let randomNumber;
let comment = "Случайный комментарий";

comment = checkCommentError(comment,MAX_LENGTH_COMMENT);
randomNumber = getRandomNumber("re",2);
console.log(randomNumber);
console.log(comment);
