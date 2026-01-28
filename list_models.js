require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API Key found in env!");
        return;
    }

    // Direct REST call to list models since SDK might hide it or throw
    // Actually, let's try a fetch if node version supports it, or https
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log(`Querying: ${url.replace(apiKey, "HIDDEN")}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }
        const data = await response.json();
        const fs = require('fs');
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        console.log("Models saved to models.json");
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
}

listModels();
