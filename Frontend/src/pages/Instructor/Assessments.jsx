import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { cn } from "@/lib/utils";
import { useTheme } from "../../components/theme-provider";
import { useToast } from "../../components/ui/toast";
import {
  Plus,
  Search,
  Users,
  BarChart2,
  Clock,
  ChevronRight,
  Loader2,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { getInstructorAssessments, deleteAssessment } from '../../api/axios.api';

const AssessmentCard = ({ assessment, onDelete, onEdit, onView }) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "p-6 rounded-2xl border group hover:border-[#6938EF]/40 transition-all duration-200",
      theme === 'dark' ? 'bg-[#110C1D] border-[#6938EF]/20' : 'bg-white border-border'
    )}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{assessment.title}</h3>
            <p className="text-sm text-muted-foreground">{assessment.field}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full",
              "bg-[#6938EF]/10 text-[#6938EF]"
            )}>
              {assessment.difficulty}
            </div>
            <div className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full",
              "bg-accent text-muted-foreground"
            )}>
              {assessment.duration} mins
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Skills Assessed</p>
            <div className="flex flex-wrap gap-2">
              {assessment.skillsAssessed.map((skill, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-2 py-1 text-xs rounded-lg",
                    theme === 'dark' ? 'bg-[#1A1425]' : 'bg-accent/50'
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {assessment.topSkillGaps && (
            <div>
              <p className="text-sm font-medium mb-2">Top Skill Gaps</p>
              <div className="flex flex-wrap gap-2">
                {assessment.topSkillGaps.map((gap, i) => (
                  <span
                    key={i}
                    className={cn(
                      "px-2 py-1 text-xs rounded-lg",
                      "bg-yellow-500/10 text-yellow-500"
                    )}
                  >
                    {gap.skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Total Attempts:</span>{' '}
              <span className="font-medium">{assessment.totalAttempts}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Average Score:</span>{' '}
              <span className="font-medium">{assessment.averageScore?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onView(assessment._id)}
              className="p-2 hover:bg-accent rounded-lg transition-colors duration-200"
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onEdit(assessment._id)}
              className="p-2 hover:bg-accent rounded-lg transition-colors duration-200"
            >
              <Edit className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => onDelete(assessment._id)}
              className="p-2 hover:bg-accent rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Assessments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await getInstructorAssessments();
      setAssessments(response.assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assessmentId) => {
    try {
      await deleteAssessment(assessmentId);
      toast({
        title: "Success",
        description: "Assessment deleted successfully",
      });
      fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive",
      });
    }
  };

  const filteredAssessments = assessments.filter(assessment =>
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#6938EF]" />
          <span className="text-muted-foreground">Loading assessments...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Assessments - Instructor Dashboard</title>
        <meta
          name="description"
          content="Create and manage skill assessments for your courses"
        />
      </Helmet>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Skill Assessments</h1>
            <p className="text-muted-foreground">Create and manage skill assessments for your courses</p>
          </div>
          <button
            onClick={() => navigate('/instructor/assessments/create')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl",
              "bg-[#6938EF] text-white hover:bg-[#5B2FD1] transition-colors duration-200"
            )}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Create Assessment</span>
          </button>
        </div>

        <div className="mb-6">
          <div className={cn(
            "flex items-center gap-3 px-4 py-2 rounded-xl border",
            "focus-within:border-[#6938EF] transition-colors duration-200"
          )}>
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No assessments found</p>
            </div>
          ) : (
            filteredAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment._id}
                assessment={assessment}
                onDelete={handleDelete}
                onEdit={(id) => navigate(`/instructor/assessments/${id}/edit`)}
                onView={(id) => navigate(`/instructor/assessments/${id}`)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Assessments; 