const SKILL_TOKEN = "➡️"
const DIFFICULTY_TOKEN = "📶"

/**
 *  Красивое
 */
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('📶') .addItem('Отчет по нагрузке', 'report_training_load').addToUi();     
}



/**
 *  Проверяет, явялется ли парараф навыком
 */
function is_skill(paragraph){
  if (paragraph.getText().includes(SKILL_TOKEN)){
    return true
  } 
  return false
}

/**
 *  Проверяет, явялется ли парараф сложностью
 */
function is_difficulty(paragraph){
  if (paragraph.getText().includes(DIFFICULTY_TOKEN)){
    return true
  } 
  return false
}


/**
 *  Проверяет, явялется ли парараф заголовком
 */
function is_heading(paragraph){
  if (paragraph.getHeading()=="HEADING3"){
    return true
  }
  return false
}



/**
 *  Получает из документа все задачки с навыками и сложностью в каждой
 */
function get_tasks(document){

  body = document.getBody()

  paragraphs = body.getParagraphs()
  tasks = [] // Здесь будем хранить задачки в формате 

  paragraphs.forEach(function(paragraph){

    if (is_heading(paragraph)){ 
      content = paragraph.getText().trim()
      if (content.length > 2) { 
        tasks.push({"title": content}) 
      }
    }
  
    if (is_skill(paragraph)){ 
      content = paragraph.getText().replace(SKILL_TOKEN, "").trim()
      tasks[tasks.length-1].skill = content
    }      

    if (is_difficulty(paragraph)){ 
        content = paragraph.getText().replace(DIFFICULTY_TOKEN, "").trim()
        tasks[tasks.length-1].difficulty = content
    }     
      
  })

  return tasks

}


/**
 *  Строит отчет в формате {skill: Навык, difficulties: {1:1, 2:1, 3:0}, tasks: ["Название задачки 1", "Название задачки 2"]}
 */
function build_report(tasks){

  skills = {}

  tasks.forEach(function(task){

    skill = task.skill
    difficulty = task.difficulty
    title = task.title

    if (skill in skills){
      null
    } else {
      skills[skill] = {"difficulties": {"1":0,"2":0,"3":0}, "tasks": []}
    }

    skills[skill]["difficulties"][difficulty] ++
    skills[skill]["tasks"].push(title)

  })

  return skills

}


/**
 *  Отрисовывает отчет по нарузке
 */


function draw_report(document, report){

  line = document.app

  document.appendHorizontalRule()
  document.appendParagraph("")
  document.appendParagraph("Отчет по нагрузке").setHeading(DocumentApp.ParagraphHeading.HEADING2) 
  document.appendParagraph("")
  

  Object.keys(report).forEach(function(skill){

    skill_stats = report[skill]
    tasks = skill_stats["tasks"]
    difficulties = skill_stats["difficulties"]

   // Выводим заголовок 
    document.appendParagraph(skill + " ( заданий " + tasks.length + " )").setHeading(DocumentApp.ParagraphHeading.HEADING4)
    document.appendParagraph("")

   // Выводим все задачки
    skill_stats.tasks.forEach(function(task){
      document.appendParagraph("Задачка: " + task)
    })
    document.appendParagraph("")

    // Выводим сложность
    Object.keys(difficulties).forEach(function(diff_level){ 

        if (difficulties[diff_level] > 0){
          document.appendParagraph("Сложность " + diff_level +": " + difficulties[diff_level])
        }
    })
 
  })

  document.appendHorizontalRule()

}




/**
 *  Главная функция
 */
function report_training_load() {

  // Получает текущий документ
  var document = DocumentApp.getActiveDocument(); 

  // Парсит документ и собирает список задач со сложностью и навыком
  tasks = get_tasks(document)

  // Формирует отчет по навыкам в задачах
  report = build_report(tasks)

  // Визуализирует отчет в конце документа
  draw_report(document, report)

}

