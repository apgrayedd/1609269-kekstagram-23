import {createHTMLElement} from './util.js';

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
  let maxComments = MAX_COMMENTS;

  function clickLikeFunction (evt) {
    evt.preventDefault();
    clickLike(buttonLike, postSumLikes, showPostLikes);
  }

  function checkButtonLoader () {
    buttonLoader.style.display = maxComments >= comments.length ? 'none' : '';
  }

  function loaderClick (evt) {
    evt.preventDefault();
    maxComments += MAX_COMMENTS;
    addComments(comments, avatarOptions, maxComments);
    checkButtonLoader();
  }

  const closePost = () => {
    maxComments = MAX_COMMENTS;
    sectionBigPicture.classList.add('hidden');
    buttonLike.classList.remove('likes-count--active');
    buttonLike.removeEventListener('click', clickLikeFunction, false);
    buttonLoader.removeEventListener('click', loaderClick, false);
    // eslint-disable-next-line no-use-before-define
    window.removeEventListener('keydown', closePostByKeyPress, false);
    cancel.removeEventListener('click',closePost, false);
    body.classList.remove('modal-open');
  };

  function closePostByKeyPress (event) {
    if (!event) {event = window.event;}
    const keyCode = event.keyCode;
    if (keyCode === 27) {
      event.preventDefault();
      closePost();
    }
  }

  function showPostClick (evt) {
    evt.preventDefault();
    sectionBigPicture.classList.remove('hidden');
    showPostImg.src = postImg.src;
    showPostDescription.textContent = postImg.alt;
    showPostLikes.textContent = postSumLikes.textContent;

    body.classList.add('modal-open');
    addComments(comments, avatarOptions, MAX_COMMENTS);
    buttonLike.addEventListener('click', clickLikeFunction, false);
    checkButtonLoader();
    buttonLoader.addEventListener('click', loaderClick, false);
    cancel.addEventListener('click', closePost, false);
    window.addEventListener('keydown', closePostByKeyPress, false);
  }
  post.addEventListener('click',showPostClick, false);
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
export {addPost,showPost};
