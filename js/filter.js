import { mixArray } from './util.js';

function addFilterOptions() {
    const filtersSection = document.querySelector('.img-filters');
    filtersSection.classList.remove('img-filters--inactive');
}

function filterDefault(postsArr) {
    return postsArr;
}

function filterByRandom(postsArr, numberRandomPosts) {
    return mixArray(postsArr).slice(0, numberRandomPosts);
}

function filterByComments(postsArr) {
    return postsArr.slice().sort((postA, postB) => postB.comments.length - postA.comments.length);
}

const clearPosts = () => {
    const posts = document.querySelectorAll('.picture');
    posts.forEach((post) => {
        post.remove();
    });
};

function postsFilter(posts, addPostsFunction, maxNumberForRandomFilter, RERENDER_DELAY) {
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
    const filterWidthDebounce = (filter, filterFunct, adds) => {
        delClassButtons();
        const filterFunction = () => {
            clearPosts();
            addPostsFunction(filterFunct(posts, adds));
        };
        const filterWidthDebounce = _.debounce(filterFunction, RERENDER_DELAY);
        filter.classList.add('img-filters__button--active');
        filterWidthDebounce();

    };
    const filterDefaultHandler = () => filterWidthDebounce(filterDefaultButton, filterDefault);
    const filterRandomHandler = () => filterWidthDebounce(filterRandomButton, filterByRandom, maxNumberForRandomFilter);
    const filterDiscussedHandler = () => filterWidthDebounce(filterDiscussedButton, filterByComments);

    addFilterOptions();
    filterDefaultButton.addEventListener('click', filterDefaultHandler, false);
    filterRandomButton.addEventListener('click', filterRandomHandler, false);
    filterDiscussedButton.addEventListener('click', filterDiscussedHandler, false);
}

export {
    postsFilter,
    filterByRandom,
    filterByComments,
    addFilterOptions,
    filterDefault
};