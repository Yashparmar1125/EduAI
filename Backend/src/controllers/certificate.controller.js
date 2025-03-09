import  Certificate  from "../models/certificate.model.js";
import mongoose from "mongoose";

const generateCertificateNumber = () => {
  // Generate a unique certificate number (you can customize this based on your needs)
  return (
    "CERT-" +
    Date.now() +
    "-" +
    Math.random().toString(36).substr(2, 6).toUpperCase()
  );
};

const issueCertificate = async (req, res) => {
  try {
    const { courseId, metadata = {} } = req.body;
    const userId = req.user.userId;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Course ID are required",
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      userId,
      courseId,
      status: "active",
    });

    if (existingCertificate) {
      return res.status(409).json({
        success: false,
        message: "Certificate already issued for this course",
      });
    }

    const certificateNumber = generateCertificateNumber();
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(issueDate.getFullYear() + 1); // Default expiry of 1 year

    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateNumber,
      issueDate,
      expiryDate,
      status: "active",
      metadata: {
        ...metadata,
        issuedThrough: metadata.issuedThrough || "course_completion",
        issuedAt: issueDate,
      },
    });

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate("userId", "name email")
      .populate("courseId", "title description");

    return res.status(201).json({
      success: true,
      message: "Certificate issued successfully",
      data: populatedCertificate,
    });
  } catch (error) {
    console.error("Error in issueCertificate:", error);
    return res.status(500).json({
      success: false,
      message: "Error while issuing certificate",
      error: error.message,
    });
  }
};

const getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!mongoose.isValidObjectId(certificateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID format",
      });
    }

    const certificate = await Certificate.findById(certificateId)
      .populate("userId", "name email")
      .populate("courseId", "title description");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Certificate retrieved successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("Error in getCertificate:", error);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving certificate",
      error: error.message,
    });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    if (!certificateNumber) {
      return res.status(400).json({
        success: false,
        message: "Certificate number is required",
      });
    }

    const certificate = await Certificate.findOne({ certificateNumber })
      .populate("userId", "name email")
      .populate("courseId", "title description");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Invalid certificate number",
      });
    }

    // Check if certificate is expired
    if (new Date() > certificate.expiryDate) {
      certificate.status = "expired";
      await certificate.save();
    }

    return res.status(200).json({
      success: true,
      message: "Certificate verification successful",
      data: certificate,
    });
  } catch (error) {
    console.error("Error in verifyCertificate:", error);
    return res.status(500).json({
      success: false,
      message: "Error while verifying certificate",
      error: error.message,
    });
  }
};

const getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const certificates = await Certificate.find({ userId })
      .populate("courseId", "title description")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User certificates retrieved successfully",
      data: certificates,
    });
  } catch (error) {
    console.error("Error in getUserCertificates:", error);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving user certificates",
      error: error.message,
    });
  }
};

const revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { reason } = req.body;

    if (!mongoose.isValidObjectId(certificateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID format",
      });
    }

    if (!reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Revocation reason is required",
      });
    }

    const certificate = await Certificate.findById(certificateId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    if (certificate.status === "revoked") {
      return res.status(400).json({
        success: false,
        message: "Certificate is already revoked",
      });
    }

    certificate.status = "revoked";
    certificate.metadata = {
      ...certificate.metadata,
      revocationReason: reason,
      revokedAt: new Date(),
    };

    await certificate.save();

    return res.status(200).json({
      success: true,
      message: "Certificate revoked successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("Error in revokeCertificate:", error);
    return res.status(500).json({
      success: false,
      message: "Error while revoking certificate",
      error: error.message,
    });
  }
};

const updateCertificateMetadata = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { metadata } = req.body;

    if (!mongoose.isValidObjectId(certificateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate ID format",
      });
    }

    if (!metadata || Object.keys(metadata).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Metadata is required",
      });
    }

    const certificate = await Certificate.findById(certificateId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    certificate.metadata = {
      ...certificate.metadata,
      ...metadata,
      updatedAt: new Date(),
    };

    await certificate.save();

    return res.status(200).json({
      success: true,
      message: "Certificate metadata updated successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("Error in updateCertificateMetadata:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating certificate metadata",
      error: error.message,
    });
  }
};

const getCourseCompletionStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const stats = await Certificate.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const formattedStats = {
      total: stats.reduce((acc, curr) => acc + curr.count, 0),
      byStatus: stats.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.status]: curr.count,
        }),
        {}
      ),
    };

    return res.status(200).json({
      success: true,
      message: "Course completion statistics retrieved successfully",
      data: formattedStats,
    });
  } catch (error) {
    console.error("Error in getCourseCompletionStats:", error);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving course completion stats",
      error: error.message,
    });
  }
};

export {
  issueCertificate,
  getCertificate,
  verifyCertificate,
  getUserCertificates,
  revokeCertificate,
  updateCertificateMetadata,
  getCourseCompletionStats,
};
