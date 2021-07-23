import {
  createHTMLElement,
  addStyles,
  createfunctionByKeyDown
} from './util.js';

function addComments (comments, avatarOptions, MAX_COMMENTS) {
  const social = document.querySelector('.social__comments');
  const commentsOnPost = comments.length > MAX_COMMENTS ? MAX_COMMENTS : comments.length;
  const showPostComments = document.querySelector('.social__comment-count');
  showPostComments.innerHTML = `${commentsOnPost} из <span class="comments-count">${comments.length}</span> комментариев`;

  social.innerHTML = '';
  const commentsFragment = document.createDocumentFragment();
  comments.slice(0,MAX_COMMENTS).forEach((comment) => {
    const newComment = createHTMLElement(
      'li',
      ['social__comment'],
    );
    const newCommentImg = createHTMLElement(
      'img',
      ['social__picture'], {
        src: comment.avatar,
        width: avatarOptions.width,
        height: avatarOptions.height,
        alt: comment.name,
      });
    const newCommentText = createHTMLElement(
      'p',
      ['social__text'],{
        textContent: comment.message,
      });
    commentsFragment.appendChild(newComment);
    newComment.appendChild(newCommentImg);
    newComment.appendChild(newCommentText);
  });
  social.appendChild(commentsFragment);
}

function clickLike (buttonLike, postLikesCount, likesCount) {
  buttonLike.classList.toggle('likes-count--active');
  const like = buttonLike.classList.contains('likes-count--active') ? 1 : -1;
  likesCount.textContent = Number(likesCount.textContent) + like;
  postLikesCount.textContent = likesCount.textContent;
}

function showPost(post, comments, avatarOptions, MAX_COMMENTS) {
  const body = document.querySelector('body');
  const sectionBigPicture = document.querySelector('.big-picture');
  const showPostImg = document.querySelector('.big-picture__img').querySelector('img');
  const showPostDescription = document.querySelector('.social__caption');
  const showPostLikes = document.querySelector('.likes-count');
  const postImg = post.querySelector('.picture__img');
  const postSumLikes = post.querySelector('.picture__likes');
  const buttonLike = document.querySelector('.likes-count');
  const buttonLoader = document.querySelector('.comments-loader');
  const cancel = document.querySelector('#picture-cancel');
  const ESC_KEY_CODE = 27;
  let maxComments = MAX_COMMENTS;

  function clickLikeHandler (evt) {
    evt.preventDefault();
    clickLike(buttonLike, postSumLikes, showPostLikes);
  }

  function checkButtonLoader () {
    buttonLoader.style.display = maxComments >= comments.length ? 'none' : '';
  }

  function loaderClickHandler (evt) {
    evt.preventDefault();
    maxComments += MAX_COMMENTS;
    addComments(comments, avatarOptions, maxComments);
    checkButtonLoader();
  }

  const closePostHandler = () => {
    maxComments = MAX_COMMENTS;
    sectionBigPicture.classList.add('hidden');
    buttonLike.classList.remove('likes-count--active');
    buttonLike.removeEventListener('click', clickLikeHandler, false);
    buttonLoader.removeEventListener('click', loaderClickHandler, false);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('keydown', closePostByKeyPressHandler, false);
    cancel.removeEventListener('click',closePostHandler, false);
    body.classList.remove('modal-open');
  };

  const closePostByKeyPressHandler = (evt) => createfunctionByKeyDown(evt, ESC_KEY_CODE, closePostHandler);

  function showPostClickHandler (evt) {
    evt.preventDefault();
    sectionBigPicture.classList.remove('hidden');
    showPostImg.src = postImg.src;
    showPostDescription.textContent = postImg.alt;
    showPostLikes.textContent = postSumLikes.textContent;

    body.classList.add('modal-open');
    addComments(comments, avatarOptions, MAX_COMMENTS);
    buttonLike.addEventListener('click', clickLikeHandler, false);
    checkButtonLoader();
    buttonLoader.addEventListener('click', loaderClickHandler, false);
    cancel.addEventListener('click', closePostHandler, false);
    window.addEventListener('keydown', closePostByKeyPressHandler, false);
  }
  post.addEventListener('click',showPostClickHandler, false);
}

function addPost (postInfo,avatarOptions,MAX_COMMENTS) {
  const picturesPlace = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const postFragment = document.createDocumentFragment();

  postInfo.forEach( ({id,url,likes,comments,description}) => {
    const post = pictureTemplate.cloneNode(true);
    const postImg = post.querySelector('.picture__img');
    const postSumComments = post.querySelector('.picture__comments');
    const postSumLikes = post.querySelector('.picture__likes');
    postImg.id = id;
    postImg.src = url;
    postImg.alt = description;
    postSumComments.textContent = comments.length;
    postSumLikes.textContent= likes;
    showPost(post, comments, avatarOptions, MAX_COMMENTS);
    postFragment.appendChild(post);
  });
  picturesPlace.appendChild(postFragment);
}

function addPostError() {
  const picturesPlace = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const postError = pictureTemplate.cloneNode(false);
  addStyles(postError, {
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'gray',
    textDecoration: 'none',
    width: '188px',
    height: '188px',
    padding: '10px',
  });
  const postErrorImg = createHTMLElement('img', false, {
    src: 'img/icon-warning.svg',
  }, {
    height: '130px',
  });
  const postErrorText = createHTMLElement('p', false, {
    textContent: 'Ошибка сети',
  }, {
    width: '100%',
    height: '10px',
    fontFamily: 'Open Sans',
    fontWeight: '700',
    fontSize: '25px',
    color: 'white',
    margin: '0 auto',
    textAlign: 'center',
  });
  postError.appendChild(postErrorImg);
  postError.appendChild(postErrorText);
  postError.addEventListener('click', (evt) => evt.preventDefault());
  picturesPlace.appendChild(postError);
}

export {
  addPost,
  showPost,
  addPostError
};
