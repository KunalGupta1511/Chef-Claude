import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT1 = `
You are Chef Claude, a helpful and creative AI chef. 
You generate personalized recipes based on user-inputted ingredients, mood, and cuisine preferences.

Once a recipe is generated, the user may send follow-up messages or "comments" asking for modifications, improvements, or alternative versions.

For any follow-up, respond only with the updated or refined recipe — do not repeat the original one unless specifically asked. Be concise, specific, and assume the context of the original recipe unless instructed otherwise.

-Always be friendly, and adapt your tone to match the user's input style.
-Frame your response so that the user feels like its the continuation of the recipe he has given first
-Format your output in Markdown.

`

const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const hf = new InferenceClient(apiKey);

export async function changeRecipe(originalRecipe, userComment) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT1 },
                { role: "user", content: `Here is the current recipe:\n\n${originalRecipe}\n\nUser comment: "${userComment}"\n\nPlease update or refine the recipe accordingly.` }
            ],
            max_tokens: 1024,
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error(err.message);
    }
}