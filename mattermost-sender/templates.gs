function showChannel(posts, messengerID, studentFullName){


    // htmlCode = "<!DOCTYPE html><html><head><base target='_top'>" +
    // "<style>body {font-family: Arial;background-color: #EDF5FE;}</style>"+
    // "</head><body>"+)+"</body></html>"

    var template = HtmlService.createTemplateFromFile('template_channel');

    // Передаем данные в шаблон

    template.data = {
      posts: posts,
      student_full_name: studentFullName,
      messenger_id: messengerID
    }

    var renderedHTML = template.evaluate().getContent();

    // Отображаем HTML код в модальном диалоге

    var html = HtmlService.createHtmlOutput(renderedHTML).setWidth(760).setHeight(600);
    SpreadsheetApp.getUi().showModalDialog(html, `Диалог с пользователем ${studentFullName}`);

}

function runDigest(){

  showDigest([])

}
