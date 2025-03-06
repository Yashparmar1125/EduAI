import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from "../../components/theme-provider";
import { cn } from "@/lib/utils";
import { ChevronLeft, Plus, X, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ui/toast';
import { getCourseDetails, updateCourse } from '../../api/axios.api';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const user = useSelector(state => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'development',
    level: 'beginner',
    modules: [{ title: '', content: '', videoUrl: '', quiz: [] }]
  });
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const  data  = await getCourseDetails(courseId);
      const course = data.course;
      
      setCourseData({
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        level: course.level,
        modules: course.modules
      });
      setPosterPreview(course.poster);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
      navigate('/instructor/courses');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleModuleChange = (index, field, value) => {
    setCourseData(prev => {
      const updatedModules = [...prev.modules];
      updatedModules[index] = {
        ...updatedModules[index],
        [field]: value
      };
      return { ...prev, modules: updatedModules };
    });
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, { title: '', content: '', videoUrl: '', quiz: [] }]
    }));
  };

  const removeModule = (index) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('price', courseData.price);
      formData.append('category', courseData.category);
      formData.append('level', courseData.level);
      formData.append('modules', JSON.stringify(courseData.modules));
      
      if (posterFile) {
        formData.append('poster', posterFile);
      }

      await updateCourse(courseId, formData);

      toast({
        title: "Success",
        description: "Course updated successfully",
        variant: "success",
      });
      navigate(`/instructor/courses/${courseId}`);
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="animate-spin">
          <Loader2 className="w-8 h-8 text-[#6938EF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/instructor/courses/${courseId}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Course Details</span>
          </button>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground mt-2">
            Update your course information and content
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Details */}
          <div className={cn(
            "p-6 rounded-xl border",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
          )}>
            <h2 className="text-xl font-semibold mb-6">Course Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                    theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                    theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={courseData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                      theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                    )}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={courseData.category}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                      theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                    )}
                    required
                  >
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={courseData.level}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg border bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                      theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                    )}
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Course Poster */}
          <div className={cn(
            "p-6 rounded-xl border",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
          )}>
            <h2 className="text-xl font-semibold mb-6">Course Poster</h2>
            
            <div className="space-y-4">
              {posterPreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={posterPreview}
                    alt="Course poster preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4 file:rounded-full
                  file:border-0 file:text-sm file:font-medium
                  file:bg-[#6938EF] file:text-white
                  hover:file:bg-[#5B2FD1]"
              />
              <p className="text-sm text-muted-foreground">
                Recommended size: 1280x720 pixels
              </p>
            </div>
          </div>

          {/* Course Modules */}
          <div className={cn(
            "p-6 rounded-xl border",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
          )}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Course Modules</h2>
              <button
                type="button"
                onClick={addModule}
                className="flex items-center gap-2 text-[#6938EF] hover:text-[#5B2FD1]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-6">
              {courseData.modules.map((module, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-xl border",
                    theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Module {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Module Title
                      </label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                        className={cn(
                          "w-full px-4 py-2 rounded-lg border bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                          theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                        )}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content
                      </label>
                      <textarea
                        value={module.content}
                        onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                        rows={4}
                        className={cn(
                          "w-full px-4 py-2 rounded-lg border bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                          theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                        )}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Video URL (optional)
                      </label>
                      <input
                        type="url"
                        value={module.videoUrl || ''}
                        onChange={(e) => handleModuleChange(index, 'videoUrl', e.target.value)}
                        className={cn(
                          "w-full px-4 py-2 rounded-lg border bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-[#6938EF]",
                          theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(`/instructor/courses/${courseId}`)}
              className={cn(
                "px-6 py-2 rounded-xl border",
                "hover:bg-accent/50 transition-colors duration-200",
                theme === 'dark' ? 'border-[#6938EF]/20' : 'border-border'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "px-6 py-2 rounded-xl",
                "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse; 