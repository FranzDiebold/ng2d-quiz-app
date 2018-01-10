function getQuestionsDict(quizId) {
  const data = getData();
  return (data[quizId] || {})['questionsDict'] || {};
}


//
function getData() {
  const cache = CacheService.getScriptCache();
  const cachedData = cache.get(CACHE_QUIZZES_KEY);
  if (cachedData != null) {
    return JSON.parse(cachedData);
  }
  const data = readDataFromSpreadsheet(QUESTION_SPREADSHEET_ID);
  cache.put(CACHE_QUIZZES_KEY, JSON.stringify(data), 60 * CACHE_EXPIRATION_IN_MINUTES);
  return data;
}

function readDataFromSpreadsheet(spreadsheetId) {
  const sheets = SpreadsheetApp.openById(spreadsheetId).getSheets();

  const quizzesDict = {};
  const quizzesValues = sheets[QUIZZES_SHEET_INDEX].getDataRange().getDisplayValues();
  for (var i = 1; i < quizzesValues.length; i++) {
    var row = quizzesValues[i];

    if (isActive(row[ACTIVE_COLUMN_INDEX])) {
      var questionsDict = readQuestionsDictFromSheet(sheets[QUESTION_SHEETS_BEGIN_INDEX + i - 1]);

      var title = row[QUIZ_TITLE_COLUMN_INDEX]
      var slugifiedTitle = slugify(title);

      quizzesDict[slugifiedTitle] = {
        id: slugifiedTitle,
        index: i,
        imageUrl: row[QUIZ_IMAGE_URL_COLUMN_INDEX],
        color: row[QUIZ_COLOR_COLUMN_INDEX],
        title: title,
        subtitle: row[QUIT_SUBTITLE_COLUMN_INDEX],
        questionsDict: questionsDict,
      };
    }
  }
  return quizzesDict;
}

function readQuestionsDictFromSheet(sheet) {
  const questionsDict = {};
  const questionValues = sheet.getDataRange().getDisplayValues();
  for (var i = 1; i < questionValues.length; i++) {
    var row = questionValues[i];

    if (isActive(row[ACTIVE_COLUMN_INDEX])) {
      var type = getQuestionTypeFromTypeString(row[QUESTION_TYPE_COLUMN_INDEX]);
      questionsDict[row[ID_COLUMN_INDEX]] = {
        id: row[ID_COLUMN_INDEX],
        type: type,
        color: row[QUESTION_COLOR_COLUMN_INDEX],
        imageUrl: row[QUESTION_IMAGE_URL_COLUMN_INDEX],
        text: row[QUESTION_TEXT_COLUMN_INDEX],
        note: row[QUESTION_NOTE_COLUMN_INDEX],
        answers: getAnswers(row, type),
        answerDescription: row[QUESTION_ANSWER_DESCRIPTION_COLUMN_INDEX],
      };
    }
  }
  return questionsDict;
}

function getAnswers(row, type) {
  const rawAnswers = row
                       .slice(QUESTION_ANSWERS_BEGIN_COLUMN_INDEX)
                       .filter(function(answer) {
                         return !!answer;
                       });

  var answers = [];
  switch (type) {
    case SINGLE_CHOICE_TYPE:
    case MULTIPLE_CHOICE_TYPE:
      const numberOfCorrectAnswers = parseInt(row[QUESTION_TYPE_COLUMN_INDEX] || '1');
      for (var i in rawAnswers) {
        answers.push({
          index: i,
          isCorrect: (i < numberOfCorrectAnswers),
          text: rawAnswers[i],
        });
      }
      break;
    case SORT_TYPE:
      for (var i in rawAnswers) {
        answers.push({
          index: i,
          text: rawAnswers[i],
        });
      }
      break;
    case TEXT_TYPE:
      answers = rawAnswers;
      break;
  }

  return answers;
}

function getQuestionTypeFromTypeString(typeString) {
  if (!typeString) {
    return SINGLE_CHOICE_TYPE;
  }
  else if (typeString.toLowerCase() === SORT_TYPE.toLowerCase()) {
    return SORT_TYPE;
  }
  else if (typeString.toLowerCase() === TEXT_TYPE.toLowerCase()) {
    return TEXT_TYPE;
  }
  else {
    return MULTIPLE_CHOICE_TYPE;
  }
}

function isActive(input) {
  return ['1', 'wahr', 'true', 'ja', 'yes'].indexOf(input.trim().toLowerCase()) > -1;
}


//
function getShuffledAnswers(answers, question, seed) {
  switch (question.type) {
    case SINGLE_CHOICE_TYPE:
    case MULTIPLE_CHOICE_TYPE:
    case SORT_TYPE:
      return Lucky.shuffle(answers, seed + question.id);
    case TEXT_TYPE:
      return answers;
      break;
  }
}
