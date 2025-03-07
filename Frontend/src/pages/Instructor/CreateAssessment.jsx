import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { useToast } from "../../components/ui/toast";
import {
  ArrowLeft,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  ChevronRight,
  Info,
  BookOpen,
  Brain,
  Clock,
  Target,
  Settings,
  FileQuestion
} from 'lucide-react';
import { createAssessment } from '../../api/axios.api';

const sections = [
  {
    id: 'basics',
    title: 'Basic Information',
    icon: Info,
    description: 'Set the fundamental details of your assessment'
  },
  {
    id: 'skills',
    title: 'Skills & Competencies',
    icon: Target,
    description: 'Define the skills and competencies to be assessed'
  },
  {
    id: 'questions',
    title: 'Questions',
    icon: FileQuestion,
    description: 'Create and manage assessment questions'
  },
  {
    id: 'settings',
    title: 'Assessment Settings',
    icon: Settings,
    description: 'Configure assessment parameters and options'
  }
];

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState('basics');
  const [saving, setSaving] = useState(false);
  const [assessment, setAssessment] = useState({
    title: '',
    field: '',
    skillsAssessed: [],
    difficulty: 'Beginner',
    duration: 60,
    questions: [],
    status: 'draft'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssessment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setAssessment(prev => ({
      ...prev,
      skillsAssessed: skills
    }));
  };

  const addQuestion = () => {
    setAssessment(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false }
          ],
          skillCategory: '',
          difficultyLevel: 'Easy'
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) => 
        qIndex === questionIndex ? {
          ...q,
          options: q.options.map((opt, oIndex) =>
            oIndex === optionIndex ? { ...opt, [field]: value } : opt
          )
        } : q
      )
    }));
  };

  const addOption = (questionIndex) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? {
          ...q,
          options: [...q.options, { text: '', isCorrect: false }]
        } : q
      )
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? {
          ...q,
          options: q.options.filter((_, oIndex) => oIndex !== optionIndex)
        } : q
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const  data  = await createAssessment(assessment);
      toast({
        title: "Success",
        description: "Assessment created successfully",
      });
      navigate(`/instructor/assessments/${data.assessment._id}`);
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create assessment",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderBasicSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={assessment.title}
          onChange={handleInputChange}
          placeholder="e.g., Full Stack Development Skills Assessment"
          className={cn(
            "w-full px-4 py-2 rounded-lg border bg-background",
            "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
          )}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Field</label>
        <input
          type="text"
          name="field"
          value={assessment.field}
          onChange={handleInputChange}
          placeholder="e.g., Web Development"
          className={cn(
            "w-full px-4 py-2 rounded-lg border bg-background",
            "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
          )}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty Level</label>
          <select
            name="difficulty"
            value={assessment.difficulty}
            onChange={handleInputChange}
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-background",
              "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
            )}
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={assessment.duration}
            onChange={handleInputChange}
            min="5"
            max="240"
            className={cn(
              "w-full px-4 py-2 rounded-lg border bg-background",
              "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
            )}
            required
          />
        </div>
      </div>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Skills to be Assessed</label>
        <p className="text-sm text-muted-foreground mb-4">
          Enter the skills you want to assess, separated by commas
        </p>
        <input
          type="text"
          value={assessment.skillsAssessed.join(', ')}
          onChange={handleSkillsChange}
          placeholder="e.g., React, Node.js, Database Design, API Development"
          className={cn(
            "w-full px-4 py-2 rounded-lg border bg-background",
            "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
          )}
          required
        />
      </div>

      {assessment.skillsAssessed.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Selected Skills</label>
          <div className="flex flex-wrap gap-2">
            {assessment.skillsAssessed.map((skill, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full",
                  "bg-[#6938EF]/10 text-[#6938EF]"
                )}
              >
                <span className="text-sm">{skill}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAssessment(prev => ({
                      ...prev,
                      skillsAssessed: prev.skillsAssessed.filter((_, i) => i !== index)
                    }));
                  }}
                  className="hover:bg-[#6938EF]/20 rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderQuestionsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Assessment Questions</h3>
          <p className="text-sm text-muted-foreground">
            Add questions to assess the selected skills
          </p>
        </div>
        <button
          type="button"
          onClick={addQuestion}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200"
          )}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Question</span>
        </button>
      </div>

      <div className="space-y-6">
        {assessment.questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className={cn(
              "p-6 rounded-xl border",
              theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-medium">Question {qIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question Text</label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                  placeholder="Enter your question"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
                  )}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Related Skill</label>
                  <select
                    value={question.skillCategory}
                    onChange={(e) => handleQuestionChange(qIndex, 'skillCategory', e.target.value)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
                    )}
                    required
                  >
                    <option value="">Select a skill</option>
                    {assessment.skillsAssessed.map((skill, index) => (
                      <option key={index} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                  <select
                    value={question.difficultyLevel}
                    onChange={(e) => handleQuestionChange(qIndex, 'difficultyLevel', e.target.value)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
                    )}
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Options</label>
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-sm text-[#6938EF] hover:underline"
                    disabled={question.options.length >= 6}
                  >
                    Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-4">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-lg border bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
                        )}
                        required
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={option.isCorrect}
                          onChange={() => {
                            const updatedOptions = question.options.map((opt, i) => ({
                              ...opt,
                              isCorrect: i === oIndex
                            }));
                            setAssessment(prev => ({
                              ...prev,
                              questions: prev.questions.map((q, i) =>
                                i === qIndex ? { ...q, options: updatedOptions } : q
                              )
                            }));
                          }}
                          className="text-[#6938EF]"
                        />
                        <span className="text-sm">Correct</span>
                      </label>
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Assessment Status</label>
        <select
          name="status"
          value={assessment.status}
          onChange={handleInputChange}
          className={cn(
            "w-full px-4 py-2 rounded-lg border bg-background",
            "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50"
          )}
        >
          <option value="draft">Save as Draft</option>
          <option value="published">Publish Immediately</option>
        </select>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'basics':
        return renderBasicSection();
      case 'skills':
        return renderSkillsSection();
      case 'questions':
        return renderQuestionsSection();
      case 'settings':
        return renderSettingsSection();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentSection) {
      case 'basics':
        return assessment.title && assessment.field;
      case 'skills':
        return assessment.skillsAssessed.length > 0;
      case 'questions':
        return assessment.questions.length > 0 && assessment.questions.every(q => 
          q.question && q.skillCategory && q.options.every(o => o.text) &&
          q.options.some(o => o.isCorrect)
        );
      case 'settings':
        return true;
      default:
        return false;
    }
  };

  const currentSectionIndex = sections.findIndex(s => s.id === currentSection);
  const isLastSection = currentSectionIndex === sections.length - 1;

  return (
    <>
      <Helmet>
        <title>Create Assessment - Instructor Dashboard</title>
        <meta
          name="description"
          content="Create a new skill assessment for your courses"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/instructor/assessments')}
              className="p-2 hover:bg-accent rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Create Assessment</h1>
              <p className="text-muted-foreground">
                Create a new skill assessment for your courses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className={cn(
                "sticky top-8 p-6 rounded-2xl border",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
              )}>
                <div className="space-y-1">
                  {sections.map((section, index) => {
                    const isActive = section.id === currentSection;
                    const isPast = sections.findIndex(s => s.id === currentSection) > index;
                    const Icon = section.icon;

                    return (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200",
                          isActive && "bg-[#6938EF] text-white",
                          !isActive && isPast && "text-[#6938EF]",
                          !isActive && !isPast && "text-muted-foreground hover:bg-accent/50"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          isActive ? "bg-white/20" : "bg-accent"
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-sm opacity-80">{section.description}</div>
                        </div>
                        {isPast && !isActive && (
                          <CheckCircle2 className="w-5 h-5 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              <div className={cn(
                "p-6 rounded-2xl border",
                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
              )}>
                <form onSubmit={handleSubmit}>
                  {renderCurrentSection()}

                  <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-border">
                    {currentSectionIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => setCurrentSection(sections[currentSectionIndex - 1].id)}
                        className={cn(
                          "px-6 py-2 rounded-xl border",
                          "hover:bg-accent/50 transition-colors duration-200",
                          theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                        )}
                      >
                        Previous
                      </button>
                    )}
                    
                    {!isLastSection ? (
                      <button
                        type="button"
                        onClick={() => setCurrentSection(sections[currentSectionIndex + 1].id)}
                        disabled={!canProceed()}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2 rounded-xl",
                          "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200",
                          !canProceed() && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={saving || !canProceed()}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2 rounded-xl",
                          "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200",
                          (saving || !canProceed()) && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span>{saving ? 'Creating...' : 'Create Assessment'}</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAssessment; 