require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini2Flash() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`API Key present: ${!!apiKey}`);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Testing generateContent with 'gemini-2.0-flash'...");
    try {
        const result = await model.generateContent("Hello, strictly reply with 'OK'.");
        const response = await result.response;
        console.log(`SUCCESS. Response: ${response.text()}`);
    } catch (error) {
        console.error("FAILURE:", error.message);
    }
}

testGemini2Flash();
