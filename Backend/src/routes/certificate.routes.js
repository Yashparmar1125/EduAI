import express from "express";

// validators import
import { certificateValidators } from "../validators/certificate.validator.js";

// controllers import
import {
  issueCertificate,
  getCertificate,
  verifyCertificate,
  getUserCertificates,
  revokeCertificate,
  updateCertificateMetadata,
  getCourseCompletionStats,
} from "../controllers/certificate.controller.js";

// middlewares import
import { authMiddleware, isInstructor } from "../middleware/auth.middleware.js";

const router = express.Router();

// public routes
router.get(
  "/verify/:certificateNumber",
  certificateValidators.verifyCertificate,
  verifyCertificate
);

// protected routes
router.post(
  "/issue",
  authMiddleware,
  certificateValidators.issueCertificate,
  issueCertificate
);

router.get(
  "/certificate/:certificateId",
  authMiddleware,
  certificateValidators.getCertificate,
  getCertificate
);

router.get(
  "/user/:userId",
  authMiddleware,
  certificateValidators.getUserCertificates,
  getUserCertificates
);

router.put(
  "/revoke/:certificateId",
  authMiddleware,
  certificateValidators.revokeCertificate,
  revokeCertificate
);

router.patch(
  "/metadata/:certificateId",
  authMiddleware,
  certificateValidators.updateMetadata,
  updateCertificateMetadata
);

router.get(
  "/stats/course/:courseId",
  authMiddleware,
  certificateValidators.getCourseStats,
  getCourseCompletionStats
);

export default router;
