// ===========================================
// AI Complaint Generator Backend
// ===========================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

// ===========================================
// Middleware
// ===========================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ===========================================
// Frontend Routes
// ===========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

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
    apiKey: process.env.GEMINI_API_KEY
});

// ===========================================
// Generate Complaint
// ===========================================

app.post("/generate", async (req, res) => {

    try {

        const {
            complaintType,
            recipient,
            problem,
            tone
        } = req.body;

        if (!complaintType || !recipient || !problem || !tone) {

            return res.status(400).json({
                success: false,
                error: "Please fill all the required fields."
            });

        }

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
- Do NOT include placeholders.
- Do NOT use Markdown.
- Keep it professional.
- Length: 180-250 words.

Return ONLY the complaint letter.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const complaint =
            response.text ||
            response.response?.text() ||
            "";

        return res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {

        console.error("Gemini Error:", error);

        return res.status(500).json({
            success: false,
            error: String(error),
            stack: error.stack
       });
    }

});

// ===========================================
// 404 Route
// ===========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

// ===========================================
// Start Server
// ===========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("--------------------------------");
    console.log("AI Complaint Generator Started");
    console.log(`Running on Port ${PORT}`);
    console.log("--------------------------------");

});
