import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { LoadingScreen } from "./LoadingScreen";
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Trophy } from 'lucide-react';
import axios from 'axios';
import { nextQuestions,updateXP} from '../../api/axios.api';

const Questions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [showReview, setShowReview] = useState(false);
    const [showAssessment, setShowAssessment] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    
    // Initial questions to determine user's level and interests
    const initialQuestions = [
        {
            id: 1,
            question: "What's your current expertise level?",
            options: [
                { label: "Beginner", description: "Just starting in the field" },
                { label: "Intermediate", description: "Have some experience but want to learn more" },
                { label: "Advanced", description: "Experienced and looking to master specific areas" }
            ]
        },
        {
            id: 2,
            question: "Which area are you most interested in?",
            options: [
                { label: "Machine Learning", description: "Building systems that learn from data" },
                { label: "Web Development", description: "Creating websites and web applications" },
                { label: "Data Science", description: "Analyzing and visualizing complex data" }
            ]
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [message, setMessage] = useState("Loading Assessment");
    const [questions, setQuestions] = useState(initialQuestions);
    const [isInitialQuestionsCompleted, setIsInitialQuestionsCompleted] = useState(false);

    const fetchAssessment = async () => {
        try {
            setIsLoading(true);
            const responses = questions.slice(0, 2).map((question, index) => ({
                question: question.question,
                answer: questions[index].options[selectedOptions[index]]?.label || ''
            }));

            const response = await axios.post('http://localhost:5000/api/assessment/next-questions', {
                responses
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (response.data.questions && response.data.questions.length > 0) {
                setAssessment({
                    id: response.data.assessmentId,
                    title: response.data.title,
                    description: response.data.description,
                    duration: response.data.duration,
                    questions: response.data.questions
                });
                // Set all questions but don't show them yet
                setQuestions([...initialQuestions, ...response.data.questions]);
                setIsInitialQuestionsCompleted(true);
                // Show instructions instead of directly continuing to questions
                setShowInstructions(true);
            } else {
                setError('No assessment available for your profile. Please try a different combination.');
            }
        } catch (error) {
            console.error('Error fetching assessment:', error);
            setError(error.response?.data?.message || 'Failed to fetch assessment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        if (currentQuestion === 1 && !isInitialQuestionsCompleted) {
            // Fetch assessment after completing initial questions
            await fetchAssessment();
            return;
        }
        
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowReview(true);
        }
    };

    const handleBack = () => {
        if (showReview) {
            setShowReview(false);
            setCurrentQuestion(questions.length - 1);
            return;
        }
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleDotClick = (index) => {
        if (showReview) return; // Disable dot navigation in review mode
        // Only allow navigation to answered questions
        if (index <= Math.max(...selectedOptions.map((_, i) => i))) {
            setCurrentQuestion(index);
        }
    };

    const handleOptionSelect = (index) => {
        const newSelections = [...selectedOptions];
        newSelections[currentQuestion] = index;
        setSelectedOptions(newSelections);
    };

    const handleSubmit = async () => {
        setMessage("Calculating Your Results...");
        setIsLoading(true);
        try {
            // Separate initial questions and assessment questions
            const initialResponses = questions.slice(0, 2).map((question, index) => ({
                question: question.question,
                answer: questions[index].options[selectedOptions[index]]?.label || ''
            }));

            // Get only assessment questions (excluding initial questions)
            const assessmentResponses = questions.slice(2).map((question, index) => {
                const actualIndex = index + 2; // Adjust index for the actual position in selectedOptions
                const selectedOption = question.options[selectedOptions[actualIndex]];
                
                return {
                    questionId: question.id,
                    question: question.question,
                    selectedOption: selectedOption?.label || '',
                    isCorrect: selectedOption?.isCorrect || false
                };
            });

            // Calculate score only from assessment questions
            const correctAnswers = assessmentResponses.filter(response => response.isCorrect).length;
            const totalQuestions = assessmentResponses.length;
            const averageScore = Math.round((correctAnswers / totalQuestions) * 100);

            await updateXP(20);

            

            setMessage("Creating Your Learning Roadmap");
            
            // Call our backend proxy instead of Langflow directly
            const langflowResponse = await axios.post(
                'http://localhost:5000/api/assessment/langflow',
                {
                    input_value: `Level: ${initialResponses[0].answer}, Interest: ${initialResponses[1].answer}`,assesmentID:assessment.id
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                }
            );
            
            // Store assessment results and roadmap data
            localStorage.setItem('assessmentResults', JSON.stringify({
                averageScore,
                totalQuestions,
                correctAnswers,
                initialResponses,
                roadmap: langflowResponse.data
            }));

            await new Promise(resolve => setTimeout(resolve, 1500));
            navigate('/roadmap');
        } catch (error) {
            console.error('Error submitting assessment:', error);
            setError(error.response?.data?.message || 'Failed to submit assessment. Please try again.');
            setMessage("Error Submitting Assessment");
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-[#6938EF] text-white rounded-lg font-medium hover:bg-[#5B2FD1]"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingScreen message={message} />;
    }

    if (showInstructions && assessment) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
                <div className="w-full max-w-3xl bg-card rounded-xl shadow-lg dark:shadow-purple-900/10">
                    <div className="p-8">
                        <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
                        <p className="text-muted-foreground mb-6">{assessment.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                                <Clock className="h-5 w-5 text-[#6938EF]" />
                                <div>
                                    <p className="text-sm font-medium">Duration</p>
                                    <p className="text-sm text-muted-foreground">{assessment.duration} minutes</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                                <BookOpen className="h-5 w-5 text-[#6938EF]" />
                                <div>
                                    <p className="text-sm font-medium">Questions</p>
                                    <p className="text-sm text-muted-foreground">{assessment.questions.length} total</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                                <Trophy className="h-5 w-5 text-[#6938EF]" />
                                <div>
                                    <p className="text-sm font-medium">Assessment Type</p>
                                    <p className="text-sm text-muted-foreground">Skill Based</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <h2 className="text-lg font-semibold">Instructions</h2>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                <li>Read each question carefully before answering</li>
                                <li>You can navigate between questions using the progress dots</li>
                                <li>You can review and change your answers before final submission</li>
                                <li>Make sure to complete all questions before submitting</li>
                                <li>The assessment will take approximately {assessment.duration} minutes</li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    setCurrentQuestion(0);
                                    setShowInstructions(false);
                                    setSelectedOptions([]);
                                }}
                                className="px-6 py-2.5 bg-accent text-foreground rounded-lg font-medium hover:bg-accent/80"
                            >
                                Change Level/Interest
                            </button>
                            <button
                                onClick={() => {
                                    setShowInstructions(false);
                                    setShowAssessment(true);
                                    setCurrentQuestion(2); // Start with first assessment question
                                }}
                                className="px-6 py-2.5 bg-[#6938EF] text-white rounded-lg font-medium hover:bg-[#5B2FD1]"
                            >
                                Start Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (showReview) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
                <div className="w-full max-w-3xl bg-card rounded-xl shadow-lg dark:shadow-purple-900/10">
                    <div className="p-6 border-b border-border">
                        <h1 className="text-xl font-semibold mb-2">Review Your Answers</h1>
                        <p className="text-sm text-muted-foreground">Please review your answers before final submission</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <span>Total Questions: {questions.length}</span>
                            <span>Answered: {selectedOptions.filter(opt => opt !== undefined).length}</span>
                        </div>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {questions.map((question, index) => (
                            <div key={index} className="mb-6 last:mb-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-muted-foreground">Question {index + 1}</span>
                                    {selectedOptions[index] !== undefined ? (
                                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Answered</span>
                                    ) : (
                                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">Not Answered</span>
                                    )}
                                </div>
                                <h3 className="text-base font-medium mb-2">{question.question}</h3>
                                {selectedOptions[index] !== undefined && (
                                    <div className="text-sm text-muted-foreground">
                                        Your answer: {question.options[selectedOptions[index]].label}
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        setShowReview(false);
                                        setCurrentQuestion(index);
                                    }}
                                    className="text-xs text-[#6938EF] hover:underline mt-2"
                                >
                                    Edit Answer
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 border-t border-border flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2.5 bg-accent text-foreground rounded-lg font-medium hover:bg-accent/80"
                        >
                            Back to Questions
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOptions.length !== questions.length}
                            className={cn(
                                "px-6 py-2.5 rounded-lg font-medium",
                                selectedOptions.length !== questions.length
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-[#6938EF] text-white hover:bg-[#5B2FD1]"
                            )}
                        >
                            Submit Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
            <div className="w-full max-w-3xl bg-card rounded-xl shadow-lg dark:shadow-purple-900/10">
                {!showAssessment && currentQuestion <= 1 ? (
                    // Show initial questions UI
                    <>
                        <div className="w-full h-1 bg-muted rounded-t-xl overflow-hidden">
                            <div 
                                className="h-full bg-[#6938EF] dark:bg-[#9D7BFF] transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / 2) * 100}%` }}
                            />
                        </div>

                        <div className="p-8">
                            <div className="mb-8">
                                <div className="text-sm text-muted-foreground mb-2">
                                    Question {currentQuestion + 1} of 2
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground">
                                    {questions[currentQuestion].question}
                                </h2>
                            </div>

                            <div className="space-y-4 mb-12">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-5 rounded-xl cursor-pointer transition-all duration-200 border-2",
                                            "hover:border-[#6938EF] dark:hover:border-[#9D7BFF]",
                                            selectedOptions[currentQuestion] === index
                                                ? "bg-[#6938EF]/10 dark:bg-[#9D7BFF]/10 border-[#6938EF] dark:border-[#9D7BFF]"
                                                : "bg-card border-border hover:bg-accent"
                                        )}
                                        onClick={() => handleOptionSelect(index)}
                                    >
                                        <div className="font-medium text-foreground">{option.label}</div>
                                        <div className="text-sm text-muted-foreground">{option.description}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleBack}
                                    className={cn(
                                        "px-6 py-2.5 rounded-lg font-medium transition-colors",
                                        currentQuestion === 0
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-accent text-foreground hover:bg-accent/80"
                                    )}
                                    disabled={currentQuestion === 0}
                                >
                                    Back
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={selectedOptions[currentQuestion] === undefined}
                                    className={cn(
                                        "px-6 py-2.5 rounded-lg font-medium transition-colors",
                                        selectedOptions[currentQuestion] === undefined
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-[#6938EF] dark:bg-[#9D7BFF] text-white hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF]"
                                    )}
                                >
                                    {currentQuestion === 1 ? "Find Assessment" : "Next"}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Show assessment questions UI
                    <>
                        {/* Assessment Info */}
                        {assessment && (
                            <div className="p-6 border-b border-border">
                                <h1 className="text-xl font-semibold mb-2">{assessment.title}</h1>
                                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                    <span>Duration: {assessment.duration} minutes</span>
                                    <span>Questions: {assessment.questions.length}</span>
                                </div>
                            </div>
                        )}

                        {/* Progress bar */}
                        <div className="w-full h-1 bg-muted rounded-t-xl overflow-hidden">
                            <div 
                                className="h-full bg-[#6938EF] dark:bg-[#9D7BFF] transition-all duration-300"
                                style={{ width: `${((currentQuestion - 1) / (questions.length - 2)) * 100}%` }}
                            />
                        </div>

                        <div className="p-8">
                            <div className="mb-8">
                                <div className="text-sm text-muted-foreground mb-2">
                                    Question {currentQuestion - 1} of {questions.length - 2}
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground">
                                    {questions[currentQuestion].question}
                                </h2>
                            </div>

                            <div className="space-y-4 mb-12">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "p-5 rounded-xl cursor-pointer transition-all duration-200 border-2",
                                            "hover:border-[#6938EF] dark:hover:border-[#9D7BFF]",
                                            selectedOptions[currentQuestion] === index
                                                ? "bg-[#6938EF]/10 dark:bg-[#9D7BFF]/10 border-[#6938EF] dark:border-[#9D7BFF]"
                                                : "bg-card border-border hover:bg-accent"
                                        )}
                                        onClick={() => handleOptionSelect(index)}
                                    >
                                        <div className="font-medium text-foreground">{option.label}</div>
                                        <div className="text-sm text-muted-foreground">{option.description}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleBack}
                                    className={cn(
                                        "px-6 py-2.5 rounded-lg font-medium transition-colors",
                                        currentQuestion === 2
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-accent text-foreground hover:bg-accent/80"
                                    )}
                                    disabled={currentQuestion === 2}
                                >
                                    Back
                                </button>

                                <div className="flex space-x-2">
                                    {questions.slice(2).map((_, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleDotClick(index + 2)}
                                            className={cn(
                                                "w-2 h-2 rounded-full cursor-pointer transition-colors",
                                                index + 2 === currentQuestion 
                                                    ? "bg-[#6938EF] dark:bg-[#9D7BFF]" 
                                                    : selectedOptions[index + 2] !== undefined
                                                    ? "bg-[#6938EF]/50 dark:bg-[#9D7BFF]/50"
                                                    : "bg-muted hover:bg-muted-foreground"
                                            )}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={selectedOptions[currentQuestion] === undefined}
                                    className={cn(
                                        "px-6 py-2.5 rounded-lg font-medium transition-colors",
                                        selectedOptions[currentQuestion] === undefined
                                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                                            : "bg-[#6938EF] dark:bg-[#9D7BFF] text-white hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF]"
                                    )}
                                >
                                    {currentQuestion === questions.length - 1 ? "Review" : "Next"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Questions;