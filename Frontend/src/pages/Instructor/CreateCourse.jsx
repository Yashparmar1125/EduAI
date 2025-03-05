import React, { useState } from 'react';
import { useTheme } from "../../components/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateCourse = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    topic: '',
    duration: '',
    links: [{ title: '', url: '' }]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...courseData.links];
    newLinks[index][field] = value;
    setCourseData(prev => ({
      ...prev,
      links: newLinks
    }));
  };

  const addNewLink = () => {
    setCourseData(prev => ({
      ...prev,
      links: [...prev.links, { title: '', url: '' }]
    }));
  };

  const removeLink = (index) => {
    const newLinks = courseData.links.filter((_, i) => i !== index);
    setCourseData(prev => ({
      ...prev,
      links: newLinks
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(courseData);
    // Navigate back to courses list
    navigate('/instructor/courses');
  };

  return (
    <div className={cn(
      "min-h-screen p-4 sm:p-8",
      theme === 'dark' ? 'bg-[#0A0118]' : 'bg-background'
    )}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <Link 
              to="/instructor/courses"
              className="text-sm text-muted-foreground hover:text-[#6938EF] flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
          </div>

          <div className={cn(
            "rounded-xl border shadow-sm p-6",
            theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-card border-border'
          )}>
            <h1 className={cn(
              "text-2xl font-bold mb-6",
              theme === 'dark' ? 'text-white' : 'text-foreground'
            )}>
              Create New Course
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Course Title</label>
                <Input
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="Enter course title"
                  className={cn(
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-background'
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Course Topic</label>
                <Input
                  name="topic"
                  value={courseData.topic}
                  onChange={handleInputChange}
                  placeholder="e.g., Web Development, Machine Learning"
                  className={cn(
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-background'
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Estimated Duration</label>
                <Input
                  name="duration"
                  value={courseData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 hours, 45 minutes"
                  className={cn(
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-background'
                  )}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Course Description</label>
                <Textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Enter course description"
                  rows={4}
                  className={cn(
                    theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-background'
                  )}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Course Content (Video Links)</label>
                  <Button
                    type="button"
                    onClick={addNewLink}
                    variant="outline"
                    size="sm"
                    className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video Link
                  </Button>
                </div>

                <div className="space-y-4">
                  {courseData.links.map((link, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        theme === 'dark' ? 'bg-[#1A1425] border-[#6938EF]/20' : 'bg-accent/50 border-border'
                      )}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="text-xs font-medium block mb-1">Video Title</label>
                            <Input
                              value={link.title}
                              onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                              placeholder="Enter video title"
                              className={cn(
                                "text-sm",
                                theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-background'
                              )}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium block mb-1">Video URL</label>
                            <div className="relative">
                              <Input
                                value={link.url}
                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                placeholder="Enter YouTube video URL"
                                className={cn(
                                  "pl-9 text-sm",
                                  theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-background'
                                )}
                              />
                              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        {courseData.links.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLink(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/instructor/courses')}
                  className="border-[#6938EF]/20 text-[#6938EF] hover:bg-[#6938EF]/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#6938EF] hover:bg-[#5B2FD1] text-white"
                >
                  Create Course
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCourse;