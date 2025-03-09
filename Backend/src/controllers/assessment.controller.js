import Assessment from "../models/assessment.model.js";
import Roadmap from "../models/roadmap.model.js";
import {
  createAssessmentSchema,
  updateAssessmentSchema,
} from "../validators/assessment.validator.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import axios from "axios";

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

    res.status(200).json({ success: true, assessments });
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

    res.status(200).json({ success: true, stats });
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

    // Find assessments related to the interest area (use title, field, or skills)
    const relatedAssessments = await Assessment.find({
      $or: [
        { title: { $regex: interestArea, $options: 'i' } },  // Case-insensitive partial match in title
        { field: { $regex: interestArea, $options: 'i' } },  // Case-insensitive partial match in field
        { skillsAssessed: { $in: [interestArea] } },  // Match if skillsAssessed contains the interestArea
      ]
    });

    // If no related assessments are found, fall back to a default assessment
    let assessment;
    if (relatedAssessments.length > 0) {
      // Choose the first related assessment or customize further
      assessment = relatedAssessments[0];
    } else {
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

    console.log("Received submission:", {
      assessmentId,
      initialResponses,
      assessmentResponses,
      averageScore,
      totalQuestions,
      correctAnswers,
    });

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
// Add this function
export const getLangflowRoadmap = async (req, res) => {
  try {
    const { input_value, assessmentScore, skillGaps } = req.body;

    const payload = {
      input_value,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "ChatInput-dOH3m": {},
        "Prompt-cMcHL": {},
        "GoogleGenerativeAIModel-3V8H5": {},
        "ChatOutput-XCd37": {},
      },
    };

    const response = await axios.post(process.env.LANGFLOW_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LANGFLOW_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error calling Langflow API:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to generate roadmap",
      details: error.response?.data || error.message,
    });
  }
};

export const getLangflowQuestions = async (req, res) => {
  try {
    const { input_value } = req.body;

    const payload = {
      input_value,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "ChatInput-dOH3m": {},
        "Prompt-cMcHL": {},
        "GoogleGenerativeAIModel-3V8H5": {},
        "ChatOutput-XCd37": {},
      },
    };

    const response = await axios.post(process.env.LANGFLOW_API_URL_2, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LANGFLOW_TOKEN_2}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error calling Langflow API:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to generate roadmap",
      details: error.response?.data || error.message,
    });
  }
};

export const createLangflowRoadmap = async (req, res) => {
  try {
    const { roadmap, name } = req.body;
    const userId = req.user.userId;
    console.log(userId, roadmap, name);
    const roadmapData = new Roadmap({
      userId,
      name,
      roadmap: JSON.stringify(roadmap),
    });
    await roadmapData.save();
    res
      .status(201)
      .json({ message: "Roadmap created successfully", roadmapData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating roadmap", error: error.message });
  }
};
