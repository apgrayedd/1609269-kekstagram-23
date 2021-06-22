function addPost (postInfo) {
  const picturesPlace = document.querySelector('.pictures');
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  const postFragment = document.createDocumentFragment()

  postInfo.forEach( ({url,comments,description,likes}) => {
    const post = pictureTemplate.cloneNode(true);
    post.querySelector('.picture__img').src = url;
    post.querySelector('.picture__img').alt = description;
    post.querySelector('.picture__comments').textContent = comments.length;
    post.querySelector('.picture__likes').textContent= likes;
    postFragment.appendChild(post);
  });
  picturesPlace.appendChild(postFragment);
}
export {addPost};
