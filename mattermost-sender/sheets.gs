class Contact {

  // Класс контакта (1 строки)

  constructor(data, keys, rowNumber ) {
    this.data = data; // данные вытащенные из строки
    this.rowNumber = rowNumber  // ссылка на объект ряда
    this.keys = keys // ключи заголовков с индексами
  }

  log() {

    Logger.log(`{this.data.student_id} {this.data.messenger_id} {this.data.message}`)

  }

  update(columnKey, newValue) {

    const columnIndex = this.keys[columnKey]
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const range = sheet.getRange(this.rowNumber + 2, columnIndex + 1)
    range.setValue(newValue)

  }

}

function getDataFromSelectedRow(){

    // Вытаскивает из выделенного ряда кому и что писать

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const activeRow = sheet.getActiveRange().getRow();
    const headers = sheet.getRange(1, 1, 2, sheet.getLastColumn()).getValues()[0];

    const userIdIndex = headers.indexOf('messenger_id');
    const userMessageIndex = headers.indexOf('message');
    const sentAtIndex = headers.indexOf('sent_at');

    if (userIdIndex === -1 || userMessageIndex === -1 || sentAtIndex === -1) {
      SpreadsheetApp.getUi().alert('Ensure "messenger_id", "message", "sent_at" columns exist.');
      return;
    }

    result = {
      receiverId: sheet.getRange(activeRow, userIdIndex + 1).getValue(),
      message: sheet.getRange(activeRow, userMessageIndex + 1).getValue() ,
      sentAtCell: sheet.getRange(activeRow, sentAtIndex + 1)
    }

    return result

}

function convertRowsToObjects(range=null) {

  // Возвращает массив элементов класса Contact для переданного ренджа (по умолчанию все контакты)

  // Откройте активную таблицу и выберите активный лист
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Получаем все данные с листа или выделения

  if (range === null) {
    Logger.log("Начинаем извлечение данных по всему листу")
    var range = sheet.getDataRange();
    var values = range.getValues().slice(1);
  } else {
    Logger.log("Начинаем извлечение данных из строки")
    var values = range.getValues()
  }

  // Получить заголовки из первой строки
  var headers = sheet.getRange(1, 1, 2, sheet.getLastColumn()).getValues()[0];

  // Массив для хранения результирующих объектов
  var result = [];

  // Преобразование каждой строки в объект начиная со второй строки
  for (var i = 0; i < values.length; i++) {
    var row = values[i];

    var objectData = {};
    var objectKeys = {}

    // Сохраняем данные и запоминаем индексы ключей - они пригодятся для редактирования
    for (var j = 0; j < headers.length; j++) {
      objectData[headers[j]] = row[j];
      objectKeys[headers[j]] = parseInt(j)
    }

    // Создаем объект строки
    obj = new Contact(objectData, objectKeys, i )

    result.push(obj);
  }

  return result;
}



function convertSelectedRowToObject(){

  // Возвращает экземпляр класса Contact для выделенного пользователем ряда

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var activeCell = sheet.getActiveCell();
  var row = activeCell.getRow();
  var lastColumn = sheet.getLastColumn();
  var rowRange = sheet.getRange(row, 1, 1, lastColumn)

  const objects = convertRowsToObjects(rowRange)
  const first_object = objects[0]
  return first_object

}



