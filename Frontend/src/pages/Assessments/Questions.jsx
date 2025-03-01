import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { LoadingScreen } from "./LoadingScreen";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Questions = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    const questions = [
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
        },
        {
            id: 3,
            question: "How much time can you dedicate weekly?",
            options: [
                { label: "1-5 hours", description: "Learning at a casual pace" },
                { label: "5-10 hours", description: "Dedicated part-time learning" },
                { label: "10+ hours", description: "Intensive learning schedule" }
            ]
        },
        {
            id: 4,
            question: "What's your primary learning goal?",
            options: [
                { label: "Career Change", description: "Transitioning to a new field" },
                { label: "Skill Enhancement", description: "Improving current abilities" },
                { label: "Personal Interest", description: "Learning for enjoyment" }
            ]
        },
        {
            id: 5,
            question: "Do you prefer theoretical or practical learning?",
            options: [
                { label: "Theoretical", description: "Understanding concepts and principles" },
                { label: "Balanced", description: "Mix of theory and practice" },
                { label: "Practical", description: "Hands-on projects and applications" }
            ]
        },
        {
            id: 6,
            question: "How do you learn best?",
            options: [
                { label: "Visual", description: "Through diagrams and demonstrations" },
                { label: "Reading", description: "Through textbooks and articles" },
                { label: "Interactive", description: "Through exercises and feedback" }
            ]
        },
        {
            id: 7,
            question: "What's your educational background?",
            options: [
                { label: "High School", description: "Basic education completed" },
                { label: "Undergraduate", description: "Bachelor's degree" },
                { label: "Graduate", description: "Master's or PhD" }
            ]
        },
        {
            id: 8,
            question: "Are you learning individually or in a group?",
            options: [
                { label: "Individual", description: "Self-paced learning" },
                { label: "Small Group", description: "With a few others" },
                { label: "Large Group", description: "Classroom or large community" }
            ]
        },
        {
            id: 9,
            question: "What's your primary motivation?",
            options: [
                { label: "Better Job", description: "Improving career prospects" },
                { label: "Higher Pay", description: "Increasing earning potential" },
                { label: "Personal Growth", description: "Self-improvement and knowledge" }
            ]
        },
        {
            id: 10,
            question: "How soon do you want to achieve your learning goals?",
            options: [
                { label: "3 months", description: "Short-term intensive learning" },
                { label: "6-12 months", description: "Medium-term balanced approach" },
                { label: "1+ years", description: "Long-term comprehensive learning" }
            ]
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(new Array(questions.length).fill(null));

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleDotClick = (index) => {
        setCurrentQuestion(index);
    };

    const handleOptionSelect = (index) => {
        const newSelections = [...selectedOptions];
        newSelections[currentQuestion] = index;
        setSelectedOptions(newSelections);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        
        try {
            // Transform selected options into API request format
            const userResponses = questions.map((question, index) => ({
                question: question.question,
                answer: question.options[selectedOptions[index]]?.label || ''
            }));

            // Make API call to Langflow
            const response = await axios.post('http://localhost:5000/api/assessment', {
                responses: userResponses
            });

            // Store the response data in localStorage or state management
            localStorage.setItem('assessmentResults', JSON.stringify(response.data));

            // Navigate to roadmap page
            navigate('/roadmap');
        } catch (error) {
            console.error('Error submitting assessment:', error);
            // Handle error appropriately
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4">
            <div className="w-full max-w-3xl bg-card rounded-xl shadow-lg dark:shadow-purple-900/10">
                {/* Progress bar */}
                <div className="w-full h-1 bg-muted rounded-t-xl overflow-hidden">
                    <div 
                        className="h-full bg-[#6938EF] dark:bg-[#9D7BFF] transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    <div className="mb-8">
                        <div className="text-sm text-muted-foreground mb-2">
                            Question {currentQuestion + 1} of {questions.length}
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

                        <div className="flex space-x-2">
                            {questions.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={cn(
                                        "w-2 h-2 rounded-full cursor-pointer transition-colors",
                                        index === currentQuestion 
                                            ? "bg-[#6938EF] dark:bg-[#9D7BFF]" 
                                            : "bg-muted hover:bg-muted-foreground"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Update the button onClick for the last question */}
                        <button
                            onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
                            className="px-6 py-2.5 bg-[#6938EF] dark:bg-[#9D7BFF] text-white rounded-lg font-medium hover:bg-[#5B2FD1] dark:hover:bg-[#8B63FF] transition-colors"
                        >
                            {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Questions;