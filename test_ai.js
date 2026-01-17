const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey: process.env.DEEPSEEK_API_KEY,
});

async function testDeepSeek() {
    try {
        console.log("Testing DeepSeek API...");
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Say hello" }],
            model: "deepseek-chat",
        });
        console.log("Success:", completion.choices[0].message.content);
    } catch (error) {
        console.error("Test Failed:", error.message);
        if (error.response) {
            console.error("Data:", error.response.data);
        }
    }
}

testDeepSeek();
