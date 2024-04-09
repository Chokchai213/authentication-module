import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import questions from "./question";
import "./RiskEvalForm_RiskEvalNormal.css";

export const EvaluationForm = ({ setshowRiskLevel, setEvaluationResult }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null)
  );
  const [isOptionSelected, setIsOptionSelected] = useState(false); // New state to track if an option is selected

  const handleOptionChange = (index, weight) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestionIndex] = { index, weight };
    setSelectedOptions(updatedSelectedOptions);
    setIsOptionSelected(true);

    console.log(index, weight);
    // Optionally calculate score immediately upon selection
    // or you can calculate the total score at the end of the quiz
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsOptionSelected(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsOptionSelected(selectedOptions[currentQuestionIndex - 1] != null); // Check if the previous question had a selection
    }
  };

  const calculateScore = () => {
    const totalScore = selectedOptions.reduce(
      (acc, curr) => acc + (curr ? curr.weight : 0),
      0
    );
    setScore(totalScore);
    setshowRiskLevel(true);
    setEvaluationResult(totalScore);

    // navigate("../Goal-based/normal-goal", { state: { score: totalScore } });
  };

  const { question, options } = questions[currentQuestionIndex];

  return (
    <React.Fragment>
      <Container >
        <div>
          <div className="MultipleChoiceForm">
            <FormControl>
              <h2>คำถาม ข้อที่ {currentQuestionIndex + 1}</h2>
              <div>
                <FormLabel id="question" className="QuestionHeader">
                  <h4>{question}</h4>
                </FormLabel>
              </div>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
              >
                {options.map((options, index) => (
                  <FormControlLabel
                    value={options.weight}
                    control={<Radio />}
                    label={options.text}
                    onChange={(e) =>
                      handleOptionChange(index, options.weight, e)
                    }
                    checked={
                      selectedOptions[currentQuestionIndex]?.index === index
                    }
                    sx={{ margin: 1 }}
                    key={"each-option-index-"+index}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
          <div className="NextAndPrevButton">
            <Stack spacing={2} direction="row">
              {currentQuestionIndex > 0 && (
                <Button variant="outlined" onClick={prevQuestion}>
                  กลับ
                </Button>
              )}
              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  variant="outlined"
                  onClick={nextQuestion}
                  disabled={!isOptionSelected}
                >
                  ต่อไป
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={calculateScore}
                  disabled={!isOptionSelected}
                >
                  ประเมินผล
                </Button>
              )}
            </Stack>
          </div>
          {/* <div>Score: {score}</div> */}
        </div>
      </Container>
    </React.Fragment>
  );
};
