require('dotenv').config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            // Filter for 'gemini' models and print clean names
            const geminiModels = data.models
                .filter(m => m.name.includes('gemini'))
                .map(m => m.name.replace('models/', ''));

            console.log("Gemini Models:");
            console.log(geminiModels.join('\n'));
        } else {
            console.log("Error:", data);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModels();
