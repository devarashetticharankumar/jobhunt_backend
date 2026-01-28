require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGeminiPro() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`API Key present: ${!!apiKey}`);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log("Testing generateContent with 'gemini-pro'...");
    try {
        const result = await model.generateContent("Hello, strictly reply with 'OK'.");
        const response = await result.response;
        console.log(`SUCCESS. Response: ${response.text()}`);
    } catch (error) {
        console.error("FAILURE:", error.message);
        if (error.response) {
            console.error("Error details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGeminiPro();
