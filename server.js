// ===========================================
// AI Complaint Generator Backend
// Internship Project
// Node.js + Express + Google Gemini API
// ===========================================

// Import Packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

// Load Environment Variables
dotenv.config();

// Create Express App
const app = express();

// ===========================================
// Middleware
// ===========================================

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===========================================
// Serve Frontend
// ===========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Health Check Route
app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running successfully."
    });
});

// ===========================================
// Gemini Configuration
// ===========================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// ===========================================
// Generate Complaint API
// ===========================================

app.post("/generate", async (req, res) => {

    try {

        console.log("New Complaint Request");

        const {
            complaintType,
            recipient,
            problem,
            tone
        } = req.body;

        // Validation
        if (
            !complaintType ||
            !recipient ||
            !problem ||
            !tone
        ) {

            return res.status(400).json({
                success: false,
                error: "Please fill all the required fields."
            });

        }

        // AI Prompt

        const prompt = `
You are an expert complaint letter writer.

Write a ${tone} complaint letter.

Complaint Type:
${complaintType}

Recipient:
${recipient}

Problem:
${problem}

Instructions:

- Start directly with the Subject.
- Do NOT include placeholders such as:
  [Your Name]
  [Date]
  [Address]
- Do NOT use Markdown.
- Do NOT use **bold** formatting.
- Write in professional English.
- Keep the complaint around 180–250 words.

The complaint must contain:

1. Subject
2. Salutation
3. Description of the issue
4. Request for immediate action
5. Thank You
6. Yours faithfully

Return ONLY the complaint letter.
`;

        // Generate Response

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const complaint = result.text;

        return res.json({
            success: true,
            complaint
        });

    }

    catch (error) {

        console.error("Gemini Error:");
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Unable to generate complaint."
        });

    }

});

// ===========================================
// Start Server
// ===========================================

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

module.exports = (req, res) => {
    return app(req, res);
};
