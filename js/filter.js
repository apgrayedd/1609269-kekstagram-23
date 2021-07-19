import {mixArray} from './util.js';
import {addPost} from './picture.js';

function addfilterOptions () {
  const filtersSection = document.querySelector('.img-filters');
  filtersSection.classList.remove('img-filters--inactive');
}

function filterByRandom(postsArr, numberRandpmPosts) {
  return mixArray(postsArr).slice(0,numberRandpmPosts);
}

function filterByComments(postsArr) {
  const likeCountPosts = [{comments:1}];
  for (let elem = 0;elem < postsArr.length; elem++) {
    likeCountPosts[elem].comments = postsArr[elem].comments;
    console.log(likeCountPosts)
  }
}

export {
  filterByRandom,
  filterByComments,
  addfilterOptions
};
