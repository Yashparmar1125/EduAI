import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_URL =
  "https://api.langflow.astra.datastax.com/lf/8cc1b12e-0394-4c0b-bdb7-16035690648a/api/v1/run/b875a095-4a08-4053-a3f5-ee95163cda7d?stream=false";
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.use(cors());
app.use(express.json());

app.post("/api/roadmap", async (req, res) => {
  try {
    console.log("📩 Received request:", req.body);

    const { skills, interests, field } = req.body;
    if (!skills || !interests || !field) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      input_value: `${skills}, ${interests}, ${field}`, 
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "ChatInput-dOH3m": {},
        "Prompt-cMcHL": {},
        "GoogleGenerativeAIModel-3V8H5": {},
        "ChatOutput-0jY1o": {},
      },
    };

    
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    console.log("✅ API Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching roadmap:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch roadmap",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
