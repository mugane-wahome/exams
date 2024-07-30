import { parseQuestions } from '@utlis/Quiz_creation'
import { useState, useEffect } from 'react'

const NewQuestionCard = () => {

    const [currentQuestion, setCurrentQuestion] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)
    const [currentQuestionText, setCurrentQuestionText] = useState('')
    const [answerOptions, setAnswerOptions] = useState({});
    const [correctOption, setCorrectOption] = useState('');
    const [context, setContext] = useState('');
    const [questions, setQuestions] = useState([])
    const [convertedQuestions, setConvertedQuestions] = useState([])
    const newQuestion = async () => {
        const newFormattedQuestion = await transformToFormattedString()
        setQuestions((prev) => [...prev, newFormattedQuestion])
    }
    const handleAddOption = () => {
        const nextOptionIndex = Object.keys(answerOptions).length;
        const nextOptionLetter = alphabet[nextOptionIndex];
        setAnswerOptions({
            ...answerOptions,
            [nextOptionLetter]: ''
        });
    };
    const handleRemoveOption = (optionLetter) => {
        let updatedOptions = { ...answerOptions };
        delete updatedOptions[optionLetter];
        setAnswerOptions(updatedOptions);

        if (correctOption === optionLetter) {
            setCorrectOption('');
        }
    };
    const handleOptionChange = (optionLetter, newText) => {
        setAnswerOptions({
            ...answerOptions,
            [optionLetter]: newText
        });
    };
    const handleSelectCorrectOption = async (optionLetter, answers = answerOptions, correct = correctOption, editMode = false) => {
        // Remove asterisk from previous correct option
        let prevCorrectOptionText;
        let cleanedPrevCorrectOptionText;
        let editedAnswers = [...answers]
        if (correct !== null) {
            prevCorrectOptionText = answers[correct];
            cleanedPrevCorrectOptionText = prevCorrectOptionText.replace('*', '');
            editedAnswers[correct] = cleanedPrevCorrectOptionText
        }
        // Mark new correct option with an asterisk
        const optionText = answers[optionLetter];
        editedAnswers[optionLetter] = optionText + '*'
        if (!editMode) {
            setAnswerOptions(editedAnswers)
            // setAnswerOptions({
            //     ...answerOptions,
            //     [correct]: cleanedPrevCorrectOptionText
            // });
            // setAnswerOptions({
            //     ...answerOptions,
            //     [optionLetter]: optionText + '*'
            // });
            setCorrectOption(optionLetter);
        }
        else {
            return editedAnswers
        }
    };
    const handleCorrectOptionEdit = async (index, editedQuestionText, editedAnswers, newOption, correct) => {
        const newAnswers = await handleSelectCorrectOption(newOption, editedAnswers, correct, true)
        handleEdit(index, editedQuestionText, newAnswers)
    }
    const handleEdit = (index, editedQuestionText, editedAnswers) => {
        let editedQuestions = [...questions]
        const formattedQuestion = transformToFormattedString(editedQuestionText, editedAnswers)
        editedQuestions[index] = formattedQuestion
        setQuestions(editedQuestions)
    }
    const convertQuestion = useCallback(async () => {
        const newQuestions = await parseQuestions(JSON.stringify(questions));
        return newQuestions;
    }, [questions]);
    const transformToFormattedString = (questionText = currentQuestionText, answers = answerOptions) => {
        let formattedString = `${questionText}\n`;
        Object.keys(answers).forEach((optionLetter, index) => {
            formattedString += `${optionLetter}. ${answers[optionLetter]}\n`;
        });
        return formattedString;
    };
    useEffect(() => {
        const convertData = async () => {
            const convertedQuestions = await convertQuestion();
            setConvertedQuestions(convertedQuestions);
        };
        convertData();
    }, [convertQuestion])
    return (
        <>
            <div className="context_box">
                <h2>
                    Context / Passage
                </h2>
                <textarea name="context_text_area" id="" cols="30" rows="10"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                />
            </div>
            {convertedQuestions.map((convertedQuestion, index) => (
                <div key={index} className='new_question_card'>
                    <input type={'text'} contentEditable={isEditing && editingIndex === index} className="question_text">
                        {convertedQuestion.text}
                    </input>
                    {Object.keys(convertedQuestion.answers).map(answerKey => (
                        <>
                            <p className="option_text">
                                {answerKey}
                            </p>
                            <input type={'text'} contentEditable={isEditing && editingIndex === index} key={answerKey} className={`answer_text ${answerKey === convertedQuestion.correct ? 'correct_option' : ''}`}>
                                {convertedQuestion.answers[answerKey]}
                            </input>
                            {isEditing && editingIndex === index &&
                                <>
                                    <button onClick={() => handleRemoveOption(optionLetter)}>Remove</button>
                                    <button onClick={() => handleSelectCorrectOption(optionLetter)}>Mark as Correct</button>
                                </>
                            }
                        </>
                    ))}
                    <p className='reason_text'>
                        {convertedQuestion.reason}
                    </p>

                    {isEditing && editingIndex === index &&
                        <button>Save Edit</button>
                    }
                    {!isEditing &&
                        <button className="edit_btn">
                            Edit
                        </button>
                    }
                </div>
            ))
            }
            <div className='new_create_form'>
                <h2>Question: <span> <input type={'text'} className={'input_box'} value={currentQuestionText} onChange={(e) => setCurrentQuestionText(e.target.value)}></input> </span></h2>
                <h4>Answers</h4>
                {Object.keys(answerOptions).map((optionLetter) => (
                    <div key={optionLetter}>
                        <input
                            type="text"
                            className='input_box'
                            value={answerOptions[optionLetter]}
                            onChange={(e) => handleOptionChange(optionLetter, e.target.value)}
                        />
                        {optionLetter === correctOption && <span> ✅ </span>}
                        <button onClick={() => handleRemoveOption(optionLetter)}>Remove</button>
                        <button onClick={() => handleSelectCorrectOption(optionLetter)}>Mark as Correct</button>
                    </div>
                ))}
                <button onClick={handleAddOption}>Add Option</button>

            </div>
            <button className="save_question_btn">
                Add Another Question
            </button>
            <button className="save_btn">
                Create Quiz
            </button>
        </>
    )
}



// Visual
// Context Field
// Questions that will be mapped over
// Q1-....>
// New Question Card
// Question text
// Answer Options
//  A1
//  A2....
// Correct Option Selector
// Reason

// How the question logic should work
// Q TEXT /n
// AO1 /n
// AO2 /n
// AO3 /n
// AO4 (Correct) * /n
// - Reason.
// 

export default NewQuestionCard