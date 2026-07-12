const { GoogleGenAI } = require("@google/genai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const {
      complaintType,
      recipient,
      problem,
      tone
    } = req.body;

    const prompt = `
You are an expert complaint letter writer.

Write a ${tone} complaint letter.

Complaint Type:
${complaintType}

Recipient:
${recipient}

Problem:
${problem}

Return ONLY the complaint letter.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({
      complaint: result.text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
};
