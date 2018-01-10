function checkAnswer(quizId, questionId, answerParameter, seed) {
  var response = {};

  const questionsDict = getQuestionsDict(quizId);
  const question = questionsDict[questionId];
  if (question) {
    const shuffledAnswers = getShuffledAnswers(question.answers, question, seed);

    const answer = getAnswerFromAnswerParameter(question, answerParameter);

    const isCorrect = checkAnswerForCorrectness(question.type, shuffledAnswers, answer);
    const correctAnswer = getCorrectAnswer(question.type, shuffledAnswers);

    response = {
      isCorrect: isCorrect,
      correctAnswer: correctAnswer,
      answerDescription: question.answerDescription,
    };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAnswerFromAnswerParameter(question, answerParameter) {
  if (answerParameter !== undefined) {
    switch (question.type) {
      case SINGLE_CHOICE_TYPE:
        var answer = parseInt(answerParameter);
        if (!isNaN(answer)) {
          return answer;
        }
        else {
          return undefined;
        }
      case MULTIPLE_CHOICE_TYPE:
      case SORT_TYPE:
        var answer;
        try {
          answer = JSON.parse(decodeURI(answerParameter));
        } catch(e) {
          return undefined;
        }

        if (answer.constructor !== Array) {
          return undefined;
        }
        return answer
      case TEXT_TYPE:
        return answerParameter;
    }
  }
  else {
    return undefined;
  }
}

function checkAnswerForCorrectness(questionType, shuffledAnswers, answer) {
  if (answer === undefined) {
    return false;
  }

  switch (questionType) {
    case SINGLE_CHOICE_TYPE:
      return shuffledAnswers[answer] !== undefined && shuffledAnswers[answer].isCorrect;
    case MULTIPLE_CHOICE_TYPE:
      for (var i in shuffledAnswers) {
        var currentAnswer = shuffledAnswers[i];
        if (currentAnswer.isCorrect !== (answer.indexOf(parseInt(i)) !== -1)) {
          return false;
        }
      }
      return true;
    case SORT_TYPE:
      if (answer.length === shuffledAnswers.length) {
        for (var i in shuffledAnswers) {
          var currentAnswer = shuffledAnswers[i];
          if (answer[currentAnswer.index] !== parseInt(i)) {
            return false;
          }
        }
        return true;
      }
      else {
        return false;
      }
    case TEXT_TYPE:
      for (var i in shuffledAnswers) {
        if (answer == shuffledAnswers[i]) {
          return true;
        }
      }
      return false;
  }
}

function getCorrectAnswer(questionType, shuffledAnswers) {
  switch (questionType) {
    case SINGLE_CHOICE_TYPE:
      for (var i in shuffledAnswers) {
        var currentAnswer = shuffledAnswers[i];
        if (currentAnswer.isCorrect) {
          return parseInt(i);
        }
      }
    case MULTIPLE_CHOICE_TYPE:
      var correctIndices = [];
      for (var i in shuffledAnswers) {
        var currentAnswer = shuffledAnswers[i];
        if (currentAnswer.isCorrect) {
          correctIndices.push(parseInt(i));
        }
      }
      return correctIndices;
    case SORT_TYPE:
      return shuffledAnswers.map(function(answer) {
                                   return answer.index;
                            })
                            .reduce(function(correctIndices, currentIndexValue, currentIndex) {
                              correctIndices[currentIndexValue] = currentIndex;
                              return correctIndices;
                            }, new Array(shuffledAnswers.length));
    case TEXT_TYPE:
      return shuffledAnswers[0];
  }
}