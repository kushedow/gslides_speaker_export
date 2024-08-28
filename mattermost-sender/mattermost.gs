function createDirectChannel(senderId,  receiverId, token) {

  var directChannelData = [senderId, receiverId];

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    payload: JSON.stringify(directChannelData)
  };

  directChannelResponse =  UrlFetchApp.fetch(BASEURL + '/channels/direct', options);
  return JSON.parse(directChannelResponse.getContentText()).id;

}


function sendMessage(receiverID, message, senderId=SENDER_ID) {

  // Получаем ID канала для личного сообщения
  var channelId = createDirectChannel(senderId, receiverID, ACCESS_TOKEN);

  // Отправляем сообщение в этот канал
  var postData = { channel_id: channelId,  message: message };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN
    },
    payload: JSON.stringify(postData)
  };

  var response = UrlFetchApp.fetch(BASEURL + '/posts', options)
  var responseData = JSON.parse(response.getContentText())
;
  return response
}

function fetchAllPostsWith(receiverId) {

  // getting direct channel

  channel_id = createDirectChannel(SENDER_ID,  receiverId, ACCESS_TOKEN)

  var options = {
    method: 'get', contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN}
  };

  var response = UrlFetchApp.fetch(BASEURL + `/channels/${channel_id}/posts`, options)
  var responseData = JSON.parse(response.getContentText())
  return responseData.posts

}

function getUsernameByID(userID){

  // Возвращает юзернейм пользователя, чтобы найти вручную

  var options = {
    method: 'get', contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + ACCESS_TOKEN}
  };

  var response = UrlFetchApp.fetch(BASEURL + `/users/${userID}`, options)
  var responseData = JSON.parse(response.getContentText())
  return responseData.username

}

function runMattermost(){

//   // table_data = convertRowsToObjects()
//   // for (one_row of table_data){

//   //      messenger_id = one_row.messenger_id
//   //      row_object = one_row.row

//   //      Logger.log()

//   // }

  result = getUsernameByID("z95hn8ezn7nz7quot1nbuddp1w")
  Logger.log(result)

  // result = fetchAllPostsWith("z95hn8ezn7nz7quot1nbuddp1w")
  // Logger.log(result)

}
