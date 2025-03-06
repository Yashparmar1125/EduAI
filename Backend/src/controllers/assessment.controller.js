import Assessment from "../models/assessment.model.js";
import {
  createAssessmentSchema,
  updateAssessmentSchema,
} from "../validators/assessment.validator.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

// Create a new assessment
export const createAssessment = async (req, res) => {
  try {
    const { error, value } = createAssessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const assessment = new Assessment({
      ...value,
      instructor: req.user.userId,
    });

    await assessment.save();
    res
      .status(201)
      .json({ message: "Assessment created successfully", assessment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating assessment", error: error.message });
  }
};

// Get all assessments for an instructor
export const getInstructorAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({
      instructor: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({ assessments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assessments", error: error.message });
  }
};

// Get a single assessment by ID
export const getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.assessmentId,
      instructor: req.user.userId,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.json({ assessment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assessment", error: error.message });
  }
};

// Update an assessment
export const updateAssessment = async (req, res) => {
  try {
    const { error, value } = updateAssessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const assessment = await Assessment.findOneAndUpdate(
      { _id: req.params.assessmentId, instructor: req.user.userId },
      { $set: value },
      { new: true }
    );

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.json({ message: "Assessment updated successfully", assessment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating assessment", error: error.message });
  }
};

// Delete an assessment
export const deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOneAndDelete({
      _id: req.params.assessmentId,
      instructor: req.user.userId,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.json({ message: "Assessment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting assessment", error: error.message });
  }
};

// Get assessment statistics
export const getAssessmentStats = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.assessmentId,
      instructor: req.user.userId,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const stats = {
      totalAttempts: assessment.totalAttempts,
      averageScore: assessment.averageScore,
      topSkillGaps: assessment.topSkillGaps,
      status: assessment.status,
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching assessment statistics",
      error: error.message,
    });
  }
};

// Get next assessment questions based on user responses
export const getNextQuestions = async (req, res) => {
  try {
    const { responses } = req.body;

    // Extract expertise level and interest area from initial responses
    const expertiseLevel = responses[0]?.answer || "Beginner";
    const interestArea = responses[1]?.answer || "Web Development";

    // Find assessment matching the user's level and interest
    var assessment = await Assessment.findOne({
      level: expertiseLevel,
      category: interestArea,
      status: "published",
    });

    if (!assessment) {
      const defaultAssessment = await Assessment.find().limit(1);
      assessment = defaultAssessment[0];
    }

    // Transform questions to match frontend format
    const formattedQuestions = assessment.questions.map((q) => ({
      id: q._id,
      question: q.question,
      options: q.options.map((opt) => ({
        label: opt.text,
        description: opt.description || "",
        isCorrect: opt.isCorrect,
      })),
    }));

    res.json({
      assessmentId: assessment._id,
      title: assessment.title,
      description: assessment.description,
      duration: assessment.duration,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error("Error in getNextQuestions:", error);
    res.status(500).json({
      message: "Error fetching assessment questions",
      error: error.message,
    });
  }
};

// Submit an assessment
export const submitAssessment = async (req, res) => {
  try {
    const {
      assessmentId,
      initialResponses,
      assessmentResponses,
      averageScore,
      totalQuestions,
      correctAnswers,
    } = req.body;

    // Find assessment by ID
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Store initial responses for user profiling
    const userProfile = {
      expertiseLevel: initialResponses[0].answer,
      interestArea: initialResponses[1].answer,
    };

    // Process assessment responses and identify skill gaps
    const skillGaps = {};
    for (const response of assessmentResponses) {
      // Find the question in the assessment
      const question = assessment.questions.find(
        (q) => q._id.toString() === response.questionId
      );
      if (!question) continue;

      // If the answer was incorrect, record the skill gap
      if (!response.isCorrect && question.skill) {
        if (!skillGaps[question.skill]) {
          skillGaps[question.skill] = {
            skill: question.skill,
            gap: 1,
            topics: [question.topic].filter(Boolean),
          };
        } else {
          skillGaps[question.skill].gap += 1;
          if (
            question.topic &&
            !skillGaps[question.skill].topics.includes(question.topic)
          ) {
            skillGaps[question.skill].topics.push(question.topic);
          }
        }
      }
    }

    // Update assessment statistics
    await Assessment.findByIdAndUpdate(assessmentId, {
      $inc: { totalAttempts: 1 },
      $set: {
        averageScore: Math.round(averageScore), // Use the calculated score from frontend
        topSkillGaps: Object.values(skillGaps).sort((a, b) => b.gap - a.gap),
      },
    });

    // Update user's assessment history
    await User.findByIdAndUpdate(req.user.userId, {
      $push: {
        assessmentHistory: {
          assessmentId,
          completedAt: new Date(),
          score: averageScore,
          expertiseLevel: userProfile.expertiseLevel,
          interestArea: userProfile.interestArea,
          correctAnswers,
          totalQuestions,
          skillGaps: Object.values(skillGaps),
        },
      },
    });

    // Generate learning recommendations based on skill gaps
    const recommendations = await generateRecommendations(
      userProfile,
      skillGaps
    );

    // Return comprehensive results
    res.json({
      success: true,
      score: {
        total: averageScore,
        correct: correctAnswers,
        questions: totalQuestions,
      },
      skillGaps: Object.values(skillGaps),
      recommendations,
      userProfile,
    });
  } catch (error) {
    console.error("Error in submitAssessment:", error);
    res.status(500).json({
      message: "Error submitting assessment",
      error: error.message,
    });
  }
};

// Helper function to generate learning recommendations
async function generateRecommendations(userProfile, skillGaps) {
  try {
    const recommendations = [];

    // Get relevant courses based on skill gaps
    const skillGapsList = Object.values(skillGaps)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 3); // Top 3 skill gaps

    for (const gap of skillGapsList) {
      // Find courses that address this skill gap
      const relevantCourses = await Course.find({
        category: userProfile.interestArea,
        level: userProfile.expertiseLevel,
        skills: { $in: [gap.skill] },
      })
        .select("title description level category")
        .limit(2);

      recommendations.push({
        skill: gap.skill,
        gapLevel: gap.gap,
        topics: gap.topics,
        suggestedCourses: relevantCourses.map((course) => ({
          id: course._id,
          title: course.title,
          description: course.description,
          level: course.level,
        })),
      });
    }

    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}
