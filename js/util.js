const getRandomNumber = (min,max) => Math.floor(Math.random() * (Math.max(max,min) - Math.min(max,min) + 1)) + Math.min(max,min);
const checkCommentError = (comment, maxLen) => comment.length < maxLen ? comment : false;
function mixArray (items = []) {
  const array = [...items];
  const mixedArray = [];
  while (array.length > 0) {
    const randomElem = array.splice(getRandomNumber(0, array.length - 1), 1)[0];
    mixedArray.push(randomElem);
  }
  return mixedArray;
}

function unique(arr) {
  const result = [];

  for (const str of arr) {
    if (result.includes(str)) {
      return false;
    } else {
      result.push(str);
    }
  }
  return true;
}
export {unique,getRandomNumber, checkCommentError, mixArray};
