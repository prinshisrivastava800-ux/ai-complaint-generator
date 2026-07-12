const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = async (req, res) => {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    const {
      complaintType,
      recipient,
      problem,
      tone,
    } = req.body;

    if (!complaintType || !recipient || !problem || !tone) {
      return res.status(400).json({
        success: false,
        error: "Please fill all the required fields.",
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
      contents: prompt,
    });

    const complaint =
      response.text ||
      response.response?.text() ||
      "";

    return res.status(200).json({
      success: true,
      complaint,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message || "Unable to generate complaint.",
    });
  }
};
