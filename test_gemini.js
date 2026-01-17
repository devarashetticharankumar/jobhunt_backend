const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key found:", apiKey ? "Yes (starts with " + apiKey.substring(0, 5) + ")" : "No");

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function testGemini() {
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

    for (const modelName of models) {
        try {
            console.log(`Testing model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`Success with ${modelName}:`, response.text());
            return; // Exit on first success
        } catch (error) {
            console.error(`Failed with ${modelName}:`, error.message);
        }
    }
}

testGemini();
