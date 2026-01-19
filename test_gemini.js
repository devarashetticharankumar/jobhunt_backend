require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`API Key Value: ${apiKey ? apiKey.substring(0, 5) + "..." : "UNDEFINED"}`);

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Checking available models...");
    try {
        // There isn't a direct listModels method on the client instance in some versions,
        // but usually we can try to generate content with a few common names to see which works.
        // Or check if there is a model listing capability. 
        // The node SDK might not expose listModels directly on genAI.
        // Let's try to just generate content with 'gemini-pro' and 'gemini-1.5-flash' explicitly.

        const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

        for (const modelName of modelsToTry) {
            console.log(`Testing model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello, are you working?");
                const response = await result.response;
                console.log(`SUCCESS: ${modelName} is working! Response: ${response.text()}`);
                return; // We found one!
            } catch (error) {
                console.log(`FAILED: ${modelName} - ${error.message}`);
            }
        }
        console.log("All models failed.");
    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();
