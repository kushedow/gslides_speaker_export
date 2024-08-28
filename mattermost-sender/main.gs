function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚡ Mattermost Bot')
    .addItem('📢 Отправить сообщение выделенной строке', 'handleSendMessage')
    .addItem('🔢 Проставить количество сообщений', 'handleGetAllResponses')
    .addItem('💬 Показать диалог с пользователем', 'handleShowDialog')
    .addToUi();
}

function handleSendMessage(){

    sendingRequest = getDataFromSelectedRow()

    receiverId = sendingRequest.receiverId
    message = sendingRequest.message

    result = JSON.parse(sendMessage(receiverId, message))

    if (result.create_at) { sendingRequest.sentAtCell.setValue("отправлено")}

    Logger.log(result)

}

function handleGetAllResponses(){

    all_records = convertRowsToObjects()


    for (record of all_records) {

        messengerID = record.data.messenger_id

        allPosts = fetchAllPostsWith(messengerID)
        allPostsList = Object.values(allPosts)
        allPostsList.sort((a,b) => a.update_at - b.update_at)
        number = allPostsList.length

        record.update("count", number)

        if (number > 0) {

          latestBy = allPostsList[number-1].user_id
          if (latestBy === SENDER_ID) {
            record.update("latest_by", "БОТ")
          } else {
            record.update("latest_by", "Пользователь")
          }

        }


    }

}

function handleShowDialog(){

  // Показывает во всплывашке историю переписки с пользователем

  // Получаем информацию из выделенного ряда
  selectedContact = convertSelectedRowToObject()

  messengerID = selectedContact.data.messenger_id
  studentFullName = selectedContact.data.student_full_name

  // Загружаем информацию из диалога с пользователем
  allPosts = fetchAllPostsWith(messengerID)
  allPostList = Object.values(allPosts)
  allPostList.sort((a,b) => a.update_at - b.update_at)

  // Показываем в красивой всплывашке
  showChannel(allPostList, messengerID, studentFullName)

}

function handleSendAll(){

    all_records = convertRowsToObjects()

    all_records = all_records.slice(387, 562);

    for (record of all_records) {

        receiverID = record.data.messenger_id
        messageText = record.data.message
        sendMessage(receiverID, messageText)
        record.update("latest_by", "БОТ")

    }
}

