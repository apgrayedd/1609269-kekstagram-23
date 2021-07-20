import {mixArray} from './util.js';

function addfilterOptions () {
  const filtersSection = document.querySelector('.img-filters');
  filtersSection.classList.remove('img-filters--inactive');
}

function filterDefault(postsArr) {
  return postsArr;
}

function filterByRandom(postsArr, numberRandpmPosts) {
  return mixArray(postsArr).slice(0,numberRandpmPosts);
}

function filterByComments(postsArr) {
  return postsArr.slice().sort((postA,postB) => postB.comments.length - postA.comments.length);
}

const clearPosts = () => {
  const posts = document.querySelectorAll('.picture');
  posts.forEach((post) => {
    post.remove();
  });
};

function postsFilter (posts, addPostsFunction, maxNumberForRandomFilter) {
  const filterButtons = document.querySelectorAll('.img-filters__button');
  const filterDefaultButton = document.querySelector('#filter-default');
  const filterRandomButton = document.querySelector('#filter-random');
  const filterDiscussedButton = document.querySelector('#filter-discussed');
  const delClassButtons = () => {
    for (const button of filterButtons) {
      if (button.classList.contains('img-filters__button--active')) {
        button.classList.remove('img-filters__button--active');
      }
    }
  };
  const filterFunction = (filter, filterFunct, adds) => {
    clearPosts();
    delClassButtons();
    addPostsFunction(filterFunct(posts, adds));
    filter.classList.add('img-filters__button--active');
  };
  const filterDefaultFuncion = () => filterFunction(filterDefaultButton,filterDefault);
  const filterRadndomFunction = () => filterFunction(filterRandomButton,filterByRandom,maxNumberForRandomFilter);
  const filterDiscussedFunction = () => filterFunction(filterDiscussedButton,filterByComments);

  addfilterOptions();
  filterDefaultButton.addEventListener('click', filterDefaultFuncion, false);
  filterRandomButton.addEventListener('click', filterRadndomFunction, false);
  filterDiscussedButton.addEventListener('click', filterDiscussedFunction, false);
}

export {
  postsFilter,
  filterByRandom,
  filterByComments,
  addfilterOptions,
  filterDefault
};
