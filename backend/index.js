require("dotenv").config();
import express, { json } from "express";
import cors from "cors";
// import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send("Backend Server is Running!");
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
