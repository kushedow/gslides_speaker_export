function onOpen() {

  var ui = SlidesApp.getUi();
  ui.createMenu('Экспорт') .addItem('Создать сценарий', 'export_scenario').addToUi();
      
}

function export_speaker_notes() {

  var ui = SlidesApp.getUi();

  Logger.log('Starting export');


  const presentation = SlidesApp.getActivePresentation();
  const slides = presentation.getSlides();

  const notes = slides
    .map((slide, index) => {
      const note = slide
        .getNotesPage()
        .getSpeakerNotesShape()
        .getText()
        .asString();
      return { index, note };
    })
    // Filter slides that have no speaker notes
    .map(({ note, index }) => {
      // return [`Slide #${index + 1}`, '---', note].join('\n');
      return [note].join('\n');
    })
    .join('\n');

    // generate_script(notes)
  
}


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
////////           ЭКСПОРТ СЦЕНАРИЯ В ТАБЛИЧКИ           ////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

function _fill_format(slide_data){

  if ("format" in slide_data) { format = slide_data.format; } else { return ""}

  switch(format) {

    case 'picture':  
    case 'fullscreen':    
      return "Картинка на весь экран"

    case 'split': 
    case 'splitscreen':    
      return "сплитскрин: картинка и спикер"
      break;    

    case 'speaker':  
      return "только спикер"
      break;

    case 'livecode':  
    case 'screencast':  
    case 'colab':        
      return "Скринкаст"
      break;

    default:
      return format

  }

}

function _fill_picture(slide_data){

  if ("pic" in slide_data) {  return slide_data.pic; }
  if ("picture" in slide_data) {  return slide_data.picture; }
  return ""

}

function _fill_episode(slide_data){

  if ("ep" in slide_data) {  
    
    if (Number.isInteger(slide_data.ep)){
      return "Эпизод " + slide_data.ep
    }

    return slide_data.ep;
    
  } else { return "";}

}

function _replace_quotes(line){
   return line.replace('“','"').replace('"','"').replace('”','"').replace('”','"').replace('“','"').replace("”",'"').replace("‘",'"').replace("’","'")
}

function _parse_slide_meta(slide_content, index = 0){
    /* Вытаскивает метаданные из json внутри slide_content и возвращает их вместе с контентом в словаре  */

    slide_content = _replace_quotes(slide_content)

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

     slide_data.content = content_without_meta; // пишем в объект контент контент без метаданных

    return slide_data;
}

function export_scenario(){

  // Выбираем на какую вкладку экпортить и поключаемся е ее объекту
  // TODO обработать ошибку неверно выбранной вкладки
  var ui = SlidesApp.getUi();
  var selected_tab = ui.prompt("На какую вкладку экспортировать сценарий").getResponseText();
  const screenplay_id = "18MXDVBUh9_QUys3Vh37cj_VEPNk3rPBx3ISGOru2BmM"
  var screenplay_sheet = SpreadsheetApp.openById(screenplay_id);
  SpreadsheetApp.setActiveSpreadsheet(screenplay_sheet);
  var sheet = screenplay_sheet.getSheetByName(selected_tab);

  // Подключаемся к объекту активной презентации
  const presentation = SlidesApp.getActivePresentation();
  const slides = presentation.getSlides();

  slides.forEach(function(slide,index){

      slide_notes = slide.getNotesPage().getSpeakerNotesShape().getText().asString();
      slide_data = _parse_slide_meta(slide_notes, index+1);

      /* Готовим содержание ячеек для таблицы*/
      slide_content = slide_data.content;
      slide_episode = _fill_episode(slide_data);;
      slide_file = " "; slide_time = " ";  // Две пустых ячейки для файла и времени
      slide_format = _fill_format(slide_data);
      slide_picture = _fill_picture(slide_data);

      // В зависимости от типа слайда – разное поведение

      if ( slide_data == "cover") {
        /* Если слайд – это обложка */
        sheet.appendRow(["########", slide_episode, "########"])
        sheet.appendRow([index+1, slide_episode, "(анимация обложки)", "Обложка", slide_file, slide_time,  slide_picture ])
        sheet.appendRow([index+1, slide_episode, slide_content, "Спикер",  slide_file, slide_time,  slide_picture ]);   
      }
      else if ( slide_data.format == "colab") {
        /* Если слайд – это переход в колаб */
        sheet.appendRow(["########", slide_episode, "########"])
        sheet.appendRow([index+1, slide_episode, slide_content, "Спикер",  slide_file, slide_time,  slide_picture ]);   
        sheet.appendRow([index+1, slide_episode, "контент скринкаста", "Скинкаст",  slide_file, slide_time, slide_picture ]);           

      } else {
        /* Если обычный слайд */
        sheet.appendRow([index+1, slide_episode,  slide_content, slide_format, slide_file, slide_time,  slide_picture ]);
      }    
  })
}




