require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Backend Server is Running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    res.json({ content: response.content[0].text });
  } catch (error) {
    console.error("❌ Error calling Claude API:", error);
    res.status(500).json({
      error: "Failed to fetch response from Claude API",
      details: error.messages,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
