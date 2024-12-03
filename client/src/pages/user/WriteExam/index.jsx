import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result = {}, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = React.useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [switchCount, setSwitchCount] = useState(0); // Counter for tab switches
  const { user } = useSelector((state) => state.users);

  // Function to calculate the result
  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];
  
      questions.forEach((question, index) => {
        const selectedOption = selectedOptions[index];
        if (question.correctOption === selectedOption) {
          correctAnswers.push({
            ...question,
            selectedOption, // Add selected option to correct answers
          });
        } else {
          wrongAnswers.push({
            ...question,
            selectedOption, // Add selected option to wrong answers
          });
        }
      });
  
      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }
  
      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);
  
      console.log("Correct Answers:", correctAnswers);
      console.log("Wrong Answers:", wrongAnswers);
      console.log("Verdict:", verdict);
  
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
  
      if (response.success) {
        console.log("Report saved successfully.");
        setView("result");
      } else {
        console.log("Error saving report:", response.message);
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      console.log("Error:", error.message);
      message.error(error.message);
    }
  };

  // Function to handle visibility change
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      setSwitchCount((prevCount) => {
        const newCount = prevCount + 1; // Increment the switch count

        if (newCount === 1) {
          // First time switching tabs
          alert("Your exam will submit if you try to switch tabs or leave the page again.");
        } else if (newCount > 1) {
          // Submit the exam if the user switches tabs again
          clearInterval(intervalId);
          setTimeUp(true);
        }
        
        return newCount; // Update the switch count
      });
    }
  };

  useEffect(() => {
    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      // Clean up the event listener
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  const getExamData = async () => {

    try {

      dispatch(ShowLoading());

      const response = await getExamById({

        examId: params.id,

      });

      dispatch(HideLoading());

      if (response.success) {

        // Fetch all questions

        const allQuestions = response.data.questions;
 
        // Randomly select two questions

        const selectedQuestions = [];

        while (selectedQuestions.length < 20 && selectedQuestions.length < allQuestions.length) {

          const randomIndex = Math.floor(Math.random() * allQuestions.length);

          const question = allQuestions[randomIndex];

          if (!selectedQuestions.includes(question)) {

            selectedQuestions.push(question);

          }

        }
 
        setQuestions(selectedQuestions);

        setExamData(response.data);

        setSecondsLeft(response.data.duration);

      } else {

        message.error(response.message);

      }

    } catch (error) {

      dispatch(HideLoading());

      message.error(error.message);

    }

  };
 

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, [params.id]);

  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-2xl">
                {selectedQuestionIndex + 1} :{" "}
                {questions[selectedQuestionIndex].name}
              </h1>

              <div className="timer">
                <span className="text-2xl">{secondsLeft}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h1 className="text-xl">
                        {option} :{" "}
                        {questions[selectedQuestionIndex].options[option]}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-between">
              {selectedQuestionIndex > 0 && (
                <button
                  className="primary-outlined-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                  }}
                >
                  Previous
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Next
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

      {view === "result" && (
        <div className="flex items-center mt-2 justify-center result">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl text-center">Your Exam has been submitted successfully!</h1>
            <div className="divider"></div>
            <div className="flex justify-center mt-4">
              <lottie-player
                src="https://assets4.lottiefiles.com/packages/lf20_ya4ycrti.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: "300px", height: "300px" }}
              ></lottie-player>
            </div>
          </div>
        </div> 
      )}


        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`flex flex-col gap-1 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}
                  key={index}
                >
                  <h1 className="text-xl">
                    {index + 1} : {question.name}
                  </h1>
                  <h1 className="text-md">
                    Submitted Answer : {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Correct Answer : {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="primary-outlined-btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                Close
              </button>
              <button
                className="primary-contained-btn"
                onClick={() => {
                  setView("instructions");
                  setSelectedQuestionIndex(0);
                  setSelectedOptions({});
                  setSecondsLeft(examData.duration);
                }}
              >
                Retake Exam
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
