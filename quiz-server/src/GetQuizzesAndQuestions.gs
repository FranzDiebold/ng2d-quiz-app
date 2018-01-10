function getQuizzesAndQuestions(seed) {
  const quizzesAndQuestionsList = getQuizzesAndQuestionsList(seed);
  return ContentService.createTextOutput(JSON.stringify(quizzesAndQuestionsList))
    .setMimeType(ContentService.MimeType.JSON);
}

function getQuizzesAndQuestionsList(seed) {
  const quizzesDict = getData();
  const quizKeys = Object.keys(quizzesDict);
  return quizKeys.map(function(quizKey) {
    return quizzesDict[quizKey];
  })
  .sort(function(quizA, quizB) {
    return quizA.index - quizB.index;
  })
  .map(function(quiz) {
    quiz['questions'] = getShuffledQuestions(quiz.questionsDict, seed);
    delete quiz.index;
    delete quiz.questionsDict;
    return quiz;
  });
}

function getShuffledQuestions(questionsDict, seed) {
  const questionKeys = Object.keys(questionsDict).sort();

  return Lucky.shuffle(questionKeys.map(function(questionId) {
    const question = questionsDict[questionId];
    const answers = question.answers;
    delete question.answers;
    delete question.answerDescription;
    switch (question.type) {
      case SINGLE_CHOICE_TYPE:
      case MULTIPLE_CHOICE_TYPE:
      case SORT_TYPE:
        question.shuffledAnswers = getShuffledAnswers(answers, question, seed)
                                     .map(function(answer) {
                                       return answer.text;
                                     });
        break;
    }
    return question;
  }), seed);
}
