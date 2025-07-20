import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT1 = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`
const SYSTEM_PROMPT2 = `
You are a creative and empathetic AI chef. The user will describe their current mood, and you must suggest a recipe that matches or complements that emotional state. The recipe should be comforting, exciting, or appropriate for how they feel. Provide the recipe name, a short explanation of why it fits the mood, a list of ingredients, and step-by-step cooking instructions. If the mood is vague or poetic, use your best judgment to match it with an imaginative dish.Format your response in markdown to make it easier to render to a web page
`

const SYSTEM_PROMPT3 = `
You are a creative and experienced chef. Based on the user's current mood and the ingredients they have on hand, suggest a unique and satisfying recipe. The recipe should reflect the emotional tone of the mood (e.g., comforting, energizing, relaxing, indulgent).You can suggest ingredients that are not listed,and you don't need to use all the ingredients listed. Include a catchy name, short description, and clear steps for preparation. Keep it friendly and concise.
`
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const hf = new InferenceClient(apiKey);

export async function getRecipeFromIngredients(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT1 },
                { role: "user", content: `I have ${ingredientsString}. Please cook a recipe for me!` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
    }
}

export async function getRecipeFromMood(moodArr) {
    const MoodsString = moodArr.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT2 },
                { role: "user", content: `I am in ${MoodsString} mood. Please suggest a recipe I could cook` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
    }
}

export async function getRecipeFromMoodAndIngredients(moodArr,ingredientsArr) {
    const MoodsString = moodArr.join(", ");
    const ingredientsString = ingredientsArr.join(", ");
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT2 },
                { role: "user", content: `I am in ${MoodsString} mood and I have ${ingredientsString} ingredients. Please suggest a recipe I could cook` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
    }
}