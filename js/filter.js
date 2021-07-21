import {mixArray} from './util.js';

function addFilterOptions () {
  const filtersSection = document.querySelector('.img-filters');
  filtersSection.classList.remove('img-filters--inactive');
}

function filterDefault(postsArr) {
  return postsArr;
}

function filterByRandom(postsArr, numberRandomPosts) {
  return mixArray(postsArr).slice(0,numberRandomPosts);
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
  const filterDefaultFunction = () => filterFunction(filterDefaultButton,filterDefault);
  const filterRandomFunction = () => filterFunction(filterRandomButton,filterByRandom,maxNumberForRandomFilter);
  const filterDiscussedFunction = () => filterFunction(filterDiscussedButton,filterByComments);

  addFilterOptions();
  filterDefaultButton.addEventListener('click', filterDefaultFunction, false);
  filterRandomButton.addEventListener('click', filterRandomFunction, false);
  filterDiscussedButton.addEventListener('click', filterDiscussedFunction, false);
}

export {
  postsFilter,
  filterByRandom,
  filterByComments,
  addFilterOptions,
  filterDefault
};
