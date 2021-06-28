function addComments (comments,MAX_COMMENTS) {
  const COMMENT_AVATAR_HEIGHT = '35';
  const COMMENT_AVATAR_WIDTH = '35';
  const social = document.querySelector('.social__comments');
  const commentsOnPost = comments.length > MAX_COMMENTS ? MAX_COMMENTS : comments.length;
  const commentStringBefore = ' из <span class="comments-count">';
  const commentStringAfter = '</span> комментариев';
  const showPostComments = document.querySelector('.social__comment-count');
  showPostComments.innerHTML = commentsOnPost + commentStringBefore + comments.length + commentStringAfter;

  social.innerHTML = '';
  const commentsFragment = document.createDocumentFragment();
  comments.slice(0,MAX_COMMENTS).forEach((comment) => {
    const newComment = document.createElement('li');
    const newCommentImg = document.createElement('img');
    const newCommentText = document.createElement('p');
    newComment.classList.add('social__comment');
    newCommentImg.classList.add('social__picture');
    newCommentText.classList.add('social__text');
    newCommentImg.src = comment.avatar;
    newCommentText.textContent = comment.message;
    newCommentImg.alt = 'Аватар комментатора фотографии';
    newCommentImg.width = COMMENT_AVATAR_WIDTH;
    newCommentImg.height = COMMENT_AVATAR_HEIGHT;
    commentsFragment.appendChild(newComment);
    newComment.appendChild(newCommentImg);
    newComment.appendChild(newCommentText);
  });
  social.appendChild(commentsFragment);
}

function showPost(post, comments, MAX_COMMENTS) {
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

  function clickLike (evt) {
    evt.preventDefault();
    buttonLike.classList.toggle('likes-count--active');
    const like = buttonLike.classList.contains('likes-count--active') ? 1 : -1;
    showPostLikes.textContent = Number(showPostLikes.textContent) + like;
    postSumLikes.textContent = showPostLikes.textContent;
  }

  function checkButtonLoader () {
    buttonLoader.style.display = maxComments >= comments.length ? 'none' : '';
  }

  function loaderClick (evt) {
    evt.preventDefault();
    maxComments += 2;
    addComments(comments,maxComments);
    checkButtonLoader();
  }

  const closePost = () => {
    maxComments = MAX_COMMENTS;
    sectionBigPicture.classList.add('hidden');
    buttonLike.classList.remove('likes-count--active');
    buttonLike.removeEventListener('click', clickLike, false);
    buttonLoader.removeEventListener('click', loaderClick, false);
    window.removeEventListener('keydown', closePostByKeyPress, false);
    cancel.removeEventListener('click',closePost, false);
    body.classList.remove('modal-open')
  };

  function closePostByKeyPress (event) {
    if (!event) {event = window.event;}
    const keyCode = event.keyCode;
    if (keyCode === 27) {
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
    addComments(comments,MAX_COMMENTS);
    buttonLike.addEventListener('click', clickLike, false);
    checkButtonLoader();
    buttonLoader.addEventListener('click', loaderClick, false);
    cancel.addEventListener('click', closePost, false);
    window.addEventListener('keydown', closePostByKeyPress, false);
  }
  post.addEventListener('click',showPostClick, false);
}

function addPost (postInfo,MAX_COMMENTS) {
  const picturesPlace = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const postFragment = document.createDocumentFragment();

  postInfo.forEach( ({url,comments,description,likes}) => {
    const post = pictureTemplate.cloneNode(true);
    const postImg = post.querySelector('.picture__img');
    const postSumComments = post.querySelector('.picture__comments');
    const postSumLikes = post.querySelector('.picture__likes');
    postImg.src = url;
    postImg.alt = description;
    postSumComments.textContent = comments.length;
    postSumLikes.textContent= likes;
    showPost(post,comments,MAX_COMMENTS);
    postFragment.appendChild(post);
  });
  picturesPlace.appendChild(postFragment);
}
export {addPost,showPost};
