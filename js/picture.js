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
    social.appendChild(newComment);
    newComment.appendChild(newCommentImg);
    newComment.appendChild(newCommentText);
  });
}

function showPost(post, comments, MAX_COMMENTS) {
  const sectionBigPicture = document.querySelector('.big-picture');
  const showPostImg = document.querySelector('.big-picture__img').querySelector('img');
  const showPostDescription = document.querySelector('.social__caption');
  const showPostLikes = document.querySelector('.likes-count');
  const buttonLoader = document.querySelector('.comments-loader');
  const cancel = document.querySelector('#picture-cancel');
  let maxComments = MAX_COMMENTS;

  post.addEventListener('click',(evt) => {
    evt.preventDefault();
    const postImg = post.querySelector('.picture__img');
    const postSumLikes = post.querySelector('.picture__likes');

    sectionBigPicture.classList.remove('hidden');
    showPostImg.src = postImg.src;
    showPostDescription.textContent = postImg.alt;
    showPostLikes.textContent = postSumLikes.textContent;
    addComments(comments,maxComments);

    buttonLoader.addEventListener('click', (evt) => {
      evt.preventDefault();
      maxComments += 2;
      addComments(comments,maxComments);
    });
  });

  cancel.addEventListener('click', (evt) => {
    evt.preventDefault();
    sectionBigPicture.classList.add('hidden');
  });
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
