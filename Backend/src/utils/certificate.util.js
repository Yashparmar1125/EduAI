import Certificate from "../models/certificate.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const generateCertificate = async (userId, courseId) => {
  try {
    // Get user and course details
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      throw new Error("User or course not found");
    }

    // Generate a unique certificate number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const certificateNumber = `CERT-${timestamp}-${random}`;

    // Create certificate
    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateNumber,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      status: "active",
      metadata: {
        studentName: user.name,
        courseTitle: course.title,
        completionDate: new Date(),
      },
    });

    return certificate._id;
  } catch (error) {
    console.error("Error generating certificate:", error);
    throw error;
  }
};

export const verifyCertificate = async (certificateId) => {
  try {
    const certificate = await Certificate.findById(certificateId)
      .populate("userId", "name")
      .populate("courseId", "title");

    if (!certificate) {
      return {
        isValid: false,
        message: "Certificate not found",
      };
    }

    // Check if certificate is expired
    if (new Date() > certificate.expiryDate) {
      return {
        isValid: false,
        message: "Certificate has expired",
      };
    }

    // Check if certificate is revoked
    if (certificate.status !== "active") {
      return {
        isValid: false,
        message: "Certificate has been revoked",
      };
    }

    return {
      isValid: true,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        studentName: certificate.userId.name,
        courseTitle: certificate.courseId.title,
        status: certificate.status,
      },
    };
  } catch (error) {
    console.error("Error verifying certificate:", error);
    throw error;
  }
};
