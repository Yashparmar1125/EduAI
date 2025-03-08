import Joi from "joi";

export const createAssessmentSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(100),
  field: Joi.string().required().trim(),
  skillsAssessed: Joi.array().items(Joi.string()).min(1).required(),
  difficulty: Joi.string()
    .valid("Beginner", "Intermediate", "Advanced")
    .required(),
  duration: Joi.number().integer().min(5).max(240).required(), // duration in minutes
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array()
          .items(
            Joi.object({
              text: Joi.string().required(),
              isCorrect: Joi.boolean().required(),
            })
          )
          .min(2)
          .max(6)
          .required(),
        skillCategory: Joi.string().required(),
        difficultyLevel: Joi.string()
          .valid("Easy", "Medium", "Hard")
          .required(),
      })
    )
    .min(1)
    .required(),
  status: Joi.string().valid("draft", "published").default("draft"),
});

export const updateAssessmentSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  field: Joi.string().trim(),
  skillsAssessed: Joi.array().items(Joi.string()).min(1),
  difficulty: Joi.string().valid("Beginner", "Intermediate", "Advanced"),
  duration: Joi.number().integer().min(5).max(240),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string(),
        options: Joi.array()
          .items(
            Joi.object({
              text: Joi.string(),
              isCorrect: Joi.boolean(),
            })
          )
          .min(2)
          .max(6),
        skillCategory: Joi.string(),
        difficultyLevel: Joi.string().valid("Easy", "Medium", "Hard"),
      })
    )
    .min(1),
  status: Joi.string().valid("draft", "published"),
}).min(1); // At least one field must be provided for update
