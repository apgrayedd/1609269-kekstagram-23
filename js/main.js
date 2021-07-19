import './util.js';
import {
  addfilterOptions,
  filterByRandom,
  filterByComments
} from './filter.js';
import {webRequest} from './web.js';
import {addPost, addPostError} from './picture.js';
import {newPostCreate} from './form.js';

const MAX_COMMENTS_POST = 5;
const MAX_LENGTH_COMMENT = 140;
const LINK_SERVER_POST = 'https://23.javascript.pages.academy/kekstagram';
const LINK_SERVER_GET = 'https://23.javascript.pages.academy/kekstagram/data';
const avatarPostOptions = {
  height: '35',
  width: '35',
};
const hashFieldOptions = {
  hashOptions: {
    firstSymbol: '#',
    min: 2,
    max: 20,
  },
  numberHash: 5,
};

const effectsOptions = [
  {
    effectName : 'none',
    effectSliderOption : {range: {min: 0,max: 100},start: 100, step: 1, connect: 'lower'},
  },
  {
    effectName : 'chrome',
    filter: (value) => `grayscale(${value/100})`,
  },
  {
    effectName : 'sepia',
    filter: (value) => `sepia(${value/100})`,
  },
  {
    effectName : 'marvin',
    filter: (value) => `invert(${value}%)`,
  },
  {
    effectName : 'phobos',
    effectSliderOption : {range: {min: 0,max: 30},start: 30},
    filter: (value) => `blur(${value/10}px)`,
  },
  {
    effectName : 'heat',
    effectSliderOption : {range: {min: 0,max: 20},start: 20},
    filter: (value) => `brightness(${value/10 + 1})`,
  },
];
const clearPosts = () => {
  const posts = document.querySelectorAll('.picture');
  posts.forEach((post) => {
    post.remove();
  });
};
const addPostsWeb = (dataPosts) => addPost(dataPosts, avatarPostOptions, MAX_COMMENTS_POST);
webRequest(LINK_SERVER_GET, [addPostsWeb], [addPostError]).then((result) => {
  addfilterOptions();
  const filterRandomButton = document.querySelector('#filter-random');
  const filterDiscussedButton = document.querySelector('#filter-discussed');
  const filterRadndomFunction = () => {
    clearPosts();
    addPost(filterByRandom(result, 10), avatarPostOptions, MAX_COMMENTS_POST);
  };
  const filterDiscussedFunction = () => {
    clearPosts();
    addPost(filterByComments(result), avatarPostOptions, MAX_COMMENTS_POST);
  };

  filterRandomButton.addEventListener('click', filterRadndomFunction, false);
  filterDiscussedButton.addEventListener('click', filterDiscussedFunction, false);
});
newPostCreate(hashFieldOptions, MAX_LENGTH_COMMENT,effectsOptions, LINK_SERVER_POST);
/*
5.1. Доступные фильтры:
«По умолчанию» — фотографии в изначальном порядке с сервера;
«Случайные» — 10 случайных, не повторяющихся фотографий;
«Обсуждаемые» — фотографии, отсортированные в порядке убывания количества комментариев.
5.2. Блок, с помощью которого производится фильтрация фотографий,
скрыт изначально и показывается только после окончания загрузки всех фотографий.
5.3. При переключении фильтров, отрисовка изображений, подходящих
 под новый фильтр, должна производиться не чаще, чем один раз 500 мс (устранение дребезга).*/
