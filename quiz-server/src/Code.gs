QUESTION_SPREADSHEET_ID = "1p7T1wYg6_8ym0JypyryvCsXt7CngNT-Tzyu_RNZ-K0g";

//

QUIZZES_SHEET_INDEX = 1;
QUESTION_SHEETS_BEGIN_INDEX = 2;

ID_COLUMN_INDEX = 0;
ACTIVE_COLUMN_INDEX = 1;

QUIZ_IMAGE_URL_COLUMN_INDEX = 2;
QUIZ_COLOR_COLUMN_INDEX = 3;
QUIZ_TITLE_COLUMN_INDEX = 4;
QUIT_SUBTITLE_COLUMN_INDEX = 5;

QUESTION_COLOR_COLUMN_INDEX = 2;
QUESTION_IMAGE_URL_COLUMN_INDEX = 3;
QUESTION_TEXT_COLUMN_INDEX = 4;
QUESTION_NOTE_COLUMN_INDEX = 5;
QUESTION_ANSWER_DESCRIPTION_COLUMN_INDEX = 6;
QUESTION_TYPE_COLUMN_INDEX = 7;
QUESTION_ANSWERS_BEGIN_COLUMN_INDEX = 8;

SINGLE_CHOICE_TYPE = 'SINGLE_CHOICE';
MULTIPLE_CHOICE_TYPE = 'MULTIPLE_CHOICE';
SORT_TYPE = 'SORT';
TEXT_TYPE = 'TEXT';

CACHE_QUIZZES_KEY = 'QUIZZES';
CACHE_EXPIRATION_IN_MINUTES = 30;

function doGet(e) {
  const quizId = e.parameter.quiz_id;
  const seed = e.parameter.seed;
  const questionId = e.parameter.question_id;
  if (seed) {
    if (quizId && questionId) {
      const answerParameter = e.parameter.answer;
      return checkAnswer(quizId, questionId, answerParameter, seed);
    }
    else {
      return getQuizzesAndQuestions(seed);
    }
  }
  else {
    return getError();
  }
}