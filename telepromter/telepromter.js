function onOpen() {
   Logger.log('Initializing...'); 
  var ui = SlidesApp.getUi();
  ui.createMenu('Экспорт') .addItem('Создать телесуфлер', 'export_teleprompter').addToUi();

   Logger.log('Menu added');       
}


function export_teleprompter(){
 
  var ui = SlidesApp.getUi();
  // TODO Заставить работать промт!
  // var doc_id = ui.prompt("Введите ID документа куда мы будем экспортировать сценарий");
  const doc = DocumentApp.openById("1_kBZKogz1iwZbErw2mJd_PJfy4Mya95p3UhqRQlWhCc");

  const presentation = SlidesApp.getActivePresentation();
  const slides = presentation.getSlides();

  slides.forEach(function(slide,index){

      slide_notes = slide.getNotesPage().getSpeakerNotesShape().getText().asString();
      slide_data = _parse_slide_meta(slide_notes, index+1);
      slide_content = slide_data.content;
      // slide_episode = _fill_episode(slide_data);;
      // slide_file = " ";
      // slide_time = " ";
      // slide_format = _fill_format(slide_data);
      // slide_picture = _fill_picture(slide_data);
      doc.appendParagraph(slide_content)   
      doc.appendParagraph("-----") 
  })



}


function _parse_slide_meta(slide_content, index = 0){

    "Вытаскивает метаданные и возвращает их вместе с контентом в словаре"  

    slide_content = slide_content.replace('“','"').replace('"','"').replace('”','"').replace('”','"').replace('“','"').replace("”",'"').replace("‘",'"').replace("’","'")


    var meta_matches  = slide_content.match("{(.*)}"); // вытаскиваем метаданные из контента
    var content_without_meta = slide_content.replace(/ *{[^)]*} */g, "").trim()// вытаскиваем контент без метаданных

    if (meta_matches !== null){

        meta_str = meta_matches[0]; // вытаскиваем из матчей первый (матчи это список)

        try {
          slide_data = JSON.parse(meta_str); // превращаем метаданные в скобочках в объект
        } catch {                            // если не получилось – ругаемся, но продолжаем
            Logger.log("Ошибка про парсинге слайда: " + (index+1) + meta_str)
            slide_data = {};            
        }
       
    } else { 
        slide_data = {};
    }

     slide_data.content = content_without_meta; // пишем в объект контент без метаданных

    return slide_data;
}
