import { InferenceClient } from "@huggingface/inference";

const SYSTEM_PROMPT1 = `
You are an assistant that receives a list of ingredients and a cuisine suggestion(if provided) that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe but stay authentic to the cuisine(if provided) given by the user. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
- Do not mix cuisines, and do not mention or use elements (like phrases or expressions) from cuisines other than the one requested.
- Do not include any sign-offs like “Bon appétit” unless it matches the selected cuisine.

`

const SYSTEM_PROMPT2 = `
You are a professional chef and recipe developer. Based on the user's selected mood and cuisine if provided (such as spicy, vegan, low-carb, indulgent,Indian Italian,Chinese etc.), suggest a creative and satisfying recipe.

- Tailor the dish to match the mood in both flavor and style.
- Stay authentic to the cuisine(if provided) given by the user.
- The recipe should include a title, ingredients list, and step-by-step instructions.
- Use common household ingredients so the recipe feels accessible and easy to try.
- Be descriptive and engaging in your tone, reflecting the chosen mood.
- Do not mix cuisines, and do not mention or use elements (like phrases or expressions) from cuisines other than the one requested.
- Do not include any sign-offs like “Bon appétit” unless it matches the selected cuisine.
- Format your output in Markdown.
`

const SYSTEM_PROMPT3 = `
You are an expert recipe creator. Based on the user's selected mood ,cuisine(if provided) and available ingredients, generate a delicious and easy-to-follow recipe.

- The recipe must reflect the user's mood (e.g., spicy, vegan, indulgent,Indian Italian,Chinese etc.).
- Stay authentic to the cuisine(if provided) given by the user.
- Suggest a recipe that is practical to prepare at home.
- Include a title, ingredients list which you can add on your own but be realistic according to a household, and step-by-step instructions.
- You can include ingredients that are not in the user's provided list.
- Do not mix cuisines, and do not mention or use elements (like phrases or expressions) from cuisines other than the one requested.
- Do not include any sign-offs like “Bon appétit” unless it matches the selected cuisine.
- Format your output in Markdown.


Be creative but stay realistic and mood-aligned.
`

const SYSTEM_PROMPT4 = `
You are a professional recipe developer. Based only on the cuisine provided by the user (such as Indian, French, Japanese, etc.), generate a traditional and authentic recipe.

Guidelines:
- Stick strictly to the user's selected cuisine. Do not include ingredients, or flavors from other cuisines.
- Do not ask the user for more information. Generate the recipe entirely based on the cuisine.
- You can give any recipe you like but it should be authentic to the cuisine.
- The recipe should include:
  - A title
  - A short description
  - An ingredients list using typical household items for that cuisine
  - Step-by-step instructions
- Keep the recipe accessible and realistic for home cooking.
- Do not mix cuisines, and do not mention cuisines other than the one requested.
- Do not mix cuisines, and do not mention or use elements (like phrases or expressions) from cuisines other than the one requested.
- Do not include any sign-offs like “Bon appétit” unless it matches the selected cuisine.
- Format your output in Markdown.

Your job is to deliver one clear and authentic recipe based on the user's cuisine input only.
`
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const hf = new InferenceClient(apiKey);

export async function getRecipeFromIngredients(ingredientsArr,cuisine) {
    const ingredientsString = ingredientsArr.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT1 },
                { role: "user", content: `I have ${ingredientsString} ${cuisine!== "" ? `and I want ${cuisine} style food` : ""}. Please cook a recipe for me!` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message);
        return true;
    }
}

export async function getRecipeFromMood(moodArr,cuisine) {
    const MoodsString = moodArr.join(", ")
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT2 },
                { role: "user", content: `I am in a mood to eat ${MoodsString} ${cuisine!== "" ? `and I want ${cuisine} style food` : ""}. Please suggest a recipe I could cook` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message);
        return true;
    }
}

export async function getRecipeFromMoodAndIngredients(moodArr, ingredientsArr,cuisine) {
    const MoodsString = moodArr.join(", ");
    const ingredientsString = ingredientsArr.join(", ");
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT3 },
                { role: "user", content: `I am in a mood to eat ${MoodsString} , ${cuisine!== "" ? `I want ${cuisine} style food` : ""} and I have ${ingredientsString} ingredients. Please suggest a recipe I could cook` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message);
        return true;
    }
}

export async function getRecipeFromCuisine(cuisine) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT4 },
                { role: "user", content: `I want to eat ${cuisine} cuisine. Please suggest an authentic ${cuisine} recipe.`},
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message);
        return true;
    }
}