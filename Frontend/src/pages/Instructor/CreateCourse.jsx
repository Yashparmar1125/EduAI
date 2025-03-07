import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import {
  Plus,
  Minus,
  ChevronLeft,
  Video,
  BookOpen,
  Target,
  Settings,
  Save,
  Upload,
  DollarSign,
  ListChecks,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useToast } from '../../components/ui/toast';
import { createCourse } from '../../api/axios.api';

const CreateCourse = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: user?._id,
    modules: [
      {
        title: '',
        content: '',
        videoUrl: '',
        quiz: []
      }
    ],
    price: 0,
    category: '',
    level: 'beginner',
    poster: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "UI/UX Design",
    "Digital Marketing",
    "Cloud Computing",
    "Cybersecurity",
    "Artificial Intelligence",
    "DevOps",
    "Blockchain"
  ];

  const steps = [
    { number: 1, title: "Basic Details", description: "Set up your course information" },
    { number: 2, title: "Course Modules", description: "Add modules and content" },
    { number: 3, title: "Preview", description: "Preview course as student" },
    { number: 4, title: "Review & Submit", description: "Review and publish your course" }
  ];

  const handleAddModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, {
        title: '',
        content: '',
        videoUrl: '',
        quiz: []
      }]
    }));
  };

  const handleRemoveModule = (index) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const handleModuleChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === index ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleAddQuiz = (moduleIndex) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              quiz: [...module.quiz, {
                question: '',
                options: ['', ''],
                correctAnswer: ''
              }]
            }
          : module
      )
    }));
  };

  const handleRemoveQuiz = (moduleIndex, quizIndex) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              quiz: module.quiz.filter((_, qi) => qi !== quizIndex)
            }
          : module
      )
    }));
  };

  const handleQuizChange = (moduleIndex, quizIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              quiz: module.quiz.map((q, qi) => 
                qi === quizIndex 
                  ? { ...q, [field]: value }
                  : q
              )
            }
          : module
      )
    }));
  };

  const handleAddQuizOption = (moduleIndex, quizIndex) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              quiz: module.quiz.map((q, qi) => 
                qi === quizIndex 
                  ? { ...q, options: [...q.options, ''] }
                  : q
              )
            }
          : module
      )
    }));
  };

  const handleRemoveQuizOption = (moduleIndex, quizIndex, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              quiz: module.quiz.map((q, qi) => 
                qi === quizIndex 
                  ? { ...q, options: q.options.filter((_, oi) => oi !== optionIndex) }
                  : q
              )
            }
          : module
      )
    }));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.title && formData.description && formData.category && formData.level;
      case 2:
        return formData.modules.every(module => module.title && module.content);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  const handleImageUpload = (file) => {
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Image size should be less than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setFormData(prev => ({ ...prev, poster: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setFormData(prev => ({ ...prev, poster: null }));
    setImagePreview(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Create FormData object
      const courseFormData = new FormData();
      
      // Append basic course details
      courseFormData.append('title', formData.title);
      courseFormData.append('description', formData.description);
      courseFormData.append('instructor', formData.instructor);
      courseFormData.append('price', formData.price);
      courseFormData.append('category', formData.category);
      courseFormData.append('level', formData.level);
      
      // Append course poster if exists
      if (formData.poster) {
        courseFormData.append('poster', formData.poster);
      }
      
      // Append modules as JSON string
      courseFormData.append('modules', JSON.stringify(formData.modules));
      
      // Send request to backend
      const data  = await createCourse(courseFormData);
        // Show success message
      toast({
        title: "Success!",
        description: data.message || "Course created successfully",
        variant: "success",
      });
      
      // Navigate to the course page
      navigate(`/instructor/courses/${data.course._id}`);
      
      
      
      
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                currentStep > step.number 
                  ? "bg-green-500 text-white"
                  : currentStep === step.number
                    ? "bg-[#6938EF] text-white"
                    : "bg-accent text-muted-foreground"
              )}>
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 mx-4 h-[2px]",
                currentStep > step.number + 1 
                  ? "bg-green-500"
                  : "bg-accent"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderBasicDetails = () => (
    <div className={cn(
      "p-6 rounded-2xl border space-y-6",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
    )}>
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-[#6938EF]" />
        <h2 className="text-xl font-semibold">Course Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Course Poster
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </label>
          <div className="flex items-start gap-6">
            <div className={cn(
              "relative w-[200px] h-[120px] rounded-xl overflow-hidden",
              "border-2 border-dashed",
              theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border',
              !imagePreview && "bg-accent/50"
            )}>
              {imagePreview ? (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Course poster" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={cn(
                      "absolute top-2 right-2 p-1 rounded-full",
                      "bg-red-500 text-white hover:bg-red-600 transition-colors"
                    )}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-xs">No poster uploaded</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="file"
                id="poster"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
              <label
                htmlFor="poster"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer",
                  "hover:bg-accent/50 transition-colors duration-200",
                  theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                )}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">Choose Image</span>
              </label>
              <p className="text-xs text-muted-foreground">
                Recommended size: 1280x720px. Max file size: 2MB.
                <br />
                Supported formats: JPG, PNG, WebP
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Course Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={cn(
              "w-full px-4 py-2 rounded-xl border bg-transparent",
              "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
              theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
            )}
            placeholder="e.g., Advanced Web Development"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={cn(
                "w-full px-4 py-2 rounded-xl border bg-transparent appearance-none",
                "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                "bg-clip-padding pr-10",
                theme === 'dark' ? 'border-[#6938EF]/20 text-white' : 'border-border text-foreground',
                theme === 'dark' ? '[&>option]:bg-[#110C1D]' : '[&>option]:bg-white',
                "cursor-pointer"
              )}
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none"
              }}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          </div>

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={cn(
              "w-full px-4 py-2 rounded-xl border bg-transparent",
              "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
              theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}
            rows={3}
            placeholder="Describe what students will learn in this course..."
                />
              </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty Level</label>
          <div className="relative">
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
              className={cn(
                "w-full px-4 py-2 rounded-xl border bg-transparent appearance-none",
                "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                "bg-clip-padding pr-10",
                theme === 'dark' ? 'border-[#6938EF]/20 text-white' : 'border-border text-foreground',
                theme === 'dark' ? '[&>option]:bg-[#110C1D]' : '[&>option]:bg-white',
                "cursor-pointer"
              )}
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none"
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border bg-transparent",
                "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}
              min={0}
              step={0.01}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className={cn(
      "p-6 rounded-2xl border space-y-6",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#6938EF]" />
          <h2 className="text-xl font-semibold">Course Modules</h2>
        </div>
        <button
          type="button"
          onClick={handleAddModule}
          className="flex items-center gap-2 text-[#6938EF] hover:underline"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Module</span>
        </button>
      </div>

      <div className="space-y-8">
        {formData.modules.map((module, moduleIndex) => (
          <div
            key={moduleIndex}
            className={cn(
              "p-6 rounded-xl border",
              theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium">Module {moduleIndex + 1}</h3>
              {moduleIndex > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveModule(moduleIndex)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove Module
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Module Title</label>
                <input
                  type="text"
                  value={module.title}
                  onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-xl border bg-transparent",
                    "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                    theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}
                  placeholder="e.g., Introduction to React Hooks"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea
                  value={module.content}
                  onChange={(e) => handleModuleChange(moduleIndex, 'content', e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded-xl border bg-transparent",
                    "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                    theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}
                  rows={4}
                  placeholder="Module content and description..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={module.videoUrl}
                    onChange={(e) => handleModuleChange(moduleIndex, 'videoUrl', e.target.value)}
                  className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-xl border bg-transparent",
                      "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                      theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}
                    placeholder="Enter video URL"
                />
                </div>
              </div>

              {/* Quiz Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Module Quiz</label>
                  <button
                    type="button"
                    onClick={() => handleAddQuiz(moduleIndex)}
                    className="flex items-center gap-2 text-[#6938EF] hover:underline text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </div>

                {module.quiz.map((quiz, quizIndex) => (
                    <div
                    key={quizIndex}
                      className={cn(
                        "p-4 rounded-lg border",
                      theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium">Question {quizIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuiz(moduleIndex, quizIndex)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Question</label>
                        <input
                          type="text"
                          value={quiz.question}
                          onChange={(e) => handleQuizChange(moduleIndex, quizIndex, 'question', e.target.value)}
                          className={cn(
                            "w-full px-4 py-2 rounded-xl border bg-transparent",
                            "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                            theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                          )}
                          placeholder="Enter quiz question"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Options</label>
                          <button
                            type="button"
                            onClick={() => handleAddQuizOption(moduleIndex, quizIndex)}
                            className="text-[#6938EF] hover:underline text-sm"
                          >
                            Add Option
                          </button>
                        </div>
                        {quiz.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...quiz.options];
                                newOptions[optionIndex] = e.target.value;
                                handleQuizChange(moduleIndex, quizIndex, 'options', newOptions);
                              }}
                              className={cn(
                                "flex-1 px-4 py-2 rounded-xl border bg-transparent",
                                "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                              )}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            {optionIndex > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveQuizOption(moduleIndex, quizIndex, optionIndex)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Correct Answer</label>
                        <div className="relative">
                          <select
                            value={quiz.correctAnswer}
                            onChange={(e) => handleQuizChange(moduleIndex, quizIndex, 'correctAnswer', e.target.value)}
                            className={cn(
                              "w-full px-4 py-2 rounded-xl border bg-transparent appearance-none",
                              "focus:outline-none focus:ring-2 focus:ring-[#6938EF]/50",
                              "bg-clip-padding pr-10",
                              theme === 'dark' ? 'border-[#6938EF]/20 text-white' : 'border-border text-foreground',
                              theme === 'dark' ? '[&>option]:bg-[#110C1D]' : '[&>option]:bg-white',
                              "cursor-pointer"
                            )}
                            style={{
                              WebkitAppearance: "none",
                              MozAppearance: "none"
                            }}
                          >
                            <option value="">Select correct answer</option>
                            {quiz.options.map((option, i) => (
                              <option key={i} value={option}>{option || `Option ${i + 1}`}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className={cn(
      "rounded-2xl border",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
    )}>
      {/* Course Header */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden">
        {imagePreview ? (
          <>
            <img 
              src={imagePreview} 
              alt="Course poster" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#6938EF] to-[#FF8A3D] opacity-80" />
        )}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium",
                theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
              )}>
                {formData.category}
              </span>
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium capitalize",
                theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/10 text-black'
              )}>
                {formData.level}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">{formData.title}</h1>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 space-y-8">
        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">About this course</h2>
          <p className="text-muted-foreground">{formData.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6938EF]" />
              <span>{formData.modules.length} {formData.modules.length === 1 ? 'Module' : 'Modules'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6938EF]" />
              <span>{formData.modules.reduce((acc, module) => acc + module.quiz.length, 0)} Quizzes</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#6938EF]" />
              <span>${formData.price}</span>
            </div>
          </div>
        </div>

        {/* Module Accordion */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Course Content</h2>
          <div className="space-y-3">
            {formData.modules.map((module, moduleIndex) => (
              <div
                key={moduleIndex}
                className={cn(
                  "border rounded-xl overflow-hidden",
                  theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                )}
              >
                <div className={cn(
                  "p-4 flex items-center justify-between",
                  theme === 'dark' ? 'bg-[#1A1625]' : 'bg-accent/50'
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      theme === 'dark' ? 'bg-[#6938EF]/20' : 'bg-white'
                    )}>
                      <span className="text-sm font-medium text-[#6938EF]">{moduleIndex + 1}</span>
                          </div>
                          <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {module.quiz.length} {module.quiz.length === 1 ? 'quiz' : 'quizzes'}
                      </p>
                    </div>
                  </div>
                  {module.videoUrl && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-4">
                  <div className="prose max-w-none">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{module.content}</p>
                  </div>
                  {module.quiz.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Practice Questions</h4>
                      {module.quiz.map((quiz, quizIndex) => (
                        <div
                          key={quizIndex}
                          className={cn(
                            "p-4 rounded-lg",
                            theme === 'dark' ? 'bg-[#1A1625]' : 'bg-accent/50'
                          )}
                        >
                          <p className="font-medium mb-3">Q{quizIndex + 1}: {quiz.question}</p>
                          <div className="space-y-2">
                            {quiz.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={cn(
                                  "p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors",
                                  theme === 'dark' ? 'hover:bg-[#6938EF]/10 bg-[#110C1D]' : 'hover:bg-accent bg-white'
                                )}
                              >
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                  theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                                )}>
                                  <span className="text-xs">{String.fromCharCode(65 + optionIndex)}</span>
                                </div>
                                <span>{option}</span>
                            </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className={cn(
      "p-6 rounded-2xl border space-y-8",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
    )}>
      <div className="flex items-center gap-3 mb-4">
        <ListChecks className="w-5 h-5 text-[#6938EF]" />
        <h2 className="text-xl font-semibold">Course Preview</h2>
      </div>

      <div className="space-y-8">
        {/* Basic Details Section */}
        <div className={cn(
          "p-6 rounded-xl border",
          theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
        )}>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#6938EF]" />
            Basic Details
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {imagePreview && (
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">Course Poster</span>
                <div className="mt-2 relative w-[200px] h-[120px] rounded-xl overflow-hidden border">
                  <img 
                    src={imagePreview} 
                    alt="Course poster" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">Title</span>
              <p className="font-medium mt-1">{formData.title}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Category</span>
              <p className="font-medium mt-1">{formData.category}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Level</span>
              <p className="font-medium capitalize mt-1">{formData.level}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Price</span>
              <p className="font-medium mt-1">${formData.price}</p>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-muted-foreground">Description</span>
              <p className="mt-1">{formData.description}</p>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6938EF]" />
            Course Content ({formData.modules.length} {formData.modules.length === 1 ? 'Module' : 'Modules'})
          </h3>
          
          {formData.modules.map((module, moduleIndex) => (
            <div
              key={moduleIndex}
              className={cn(
                "p-6 rounded-xl border",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#6938EF]" />
                    Module {moduleIndex + 1}: {module.title}
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Content</span>
                    <p className="mt-1 whitespace-pre-wrap">{module.content}</p>
                  </div>

                  {module.videoUrl && (
                    <div>
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video URL
                      </span>
                      <a 
                        href={module.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6938EF] hover:underline mt-1 block"
                      >
                        {module.videoUrl}
                      </a>
                    </div>
                  )}

                  {module.quiz.length > 0 && (
                    <div className="space-y-4">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-[#6938EF]" />
                        Quiz ({module.quiz.length} {module.quiz.length === 1 ? 'Question' : 'Questions'})
                      </span>
                      
                      {module.quiz.map((quiz, quizIndex) => (
                        <div
                          key={quizIndex}
                          className={cn(
                            "p-4 rounded-lg border",
                            theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                          )}
                        >
                          <div className="space-y-3">
                            <p className="font-medium">Q{quizIndex + 1}: {quiz.question}</p>
                            <div className="pl-4 space-y-2">
                              {quiz.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={cn(
                                    "p-2 rounded-lg",
                                    option === quiz.correctAnswer
                                      ? "bg-green-500/10 border border-green-500/20"
                                      : "bg-accent/50"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{String.fromCharCode(65 + optionIndex)}.</span>
                                    <span className={cn(
                                      option === quiz.correctAnswer && "font-medium text-green-500"
                                    )}>
                                      {option || `Option ${optionIndex + 1}`}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Courses</span>
            </button>
            <h1 className="text-3xl font-bold">Create New Course</h1>
            <p className="text-muted-foreground mt-2">
              Create a comprehensive course with modules, content, and quizzes
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="space-y-8">
          {currentStep === 1 && renderBasicDetails()}
          {currentStep === 2 && renderModules()}
          {currentStep === 3 && renderPreview()}
          {currentStep === 4 && renderReview()}

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl border",
                  "hover:bg-accent/50 transition-colors duration-200",
                  theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border',
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(currentStep) || isSubmitting}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl",
                  "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200",
                  (!validateStep(currentStep) || isSubmitting) && "opacity-50 cursor-not-allowed"
                )}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl",
                  "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Course...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Course</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;