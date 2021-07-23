import {loadMessage} from './util.js';

function webRequest (
  linkServerData,
  onSuccessArr,
  onErrorArr,
  dataRequest,
) {
  const fetchOption = dataRequest ? {method: 'POST',body: new FormData(dataRequest)} : {method: 'GET'};
  loadMessage();
  return fetch(linkServerData, fetchOption)
    .then((json) => {
      if (json.ok) {
        return json.json();
      }
      throw new Error('Ошибка подключения к серверу');
    })
    .then((result) => {
      if (onSuccessArr) {
        onSuccessArr.forEach((functionOnSuccess) => {
          functionOnSuccess(result);
        });
      }
      loadMessage();
      return result;
    })
    .catch((err) => {
      if (onErrorArr) {
        onErrorArr.forEach((functionOnError) => {
          functionOnError(err);
        });
      }
      loadMessage();
      return false;
    });
}

export {webRequest};
