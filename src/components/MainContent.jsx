import React, { useEffect } from "react"
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from "../ai"

export default function () {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const recipeSection = React.useRef(null);

    useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            // recipeSection.current.scrollIntoView({behaviour : "smooth"});
            const yCoord = recipeSection.current.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
    }, [recipe])

    function handleSubmit(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    }

    async function handleClick() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients);
        setRecipe(recipeMarkdown);
    }

    return <>
        <main>
            <section className="description">
                <div className="heading">Smart Recipes, Made Just for You</div>
                <div className="text">
                    <div className="content">
                        Hungry but not sure what to make? Our Chef Claude turns your cravings, ingredients, and preferences into delicious ideas. Here is how it works:
                    </div>
                    <div className="sub-heading">- Tell Us What You have Got</div>
                    <div className="content">
                        Input the ingredients you have at home(atleast 4) or tell us what you are in the mood for. Whether its spicy, vegan, low-carb, or indulgent—we have got it covered.
                    </div>
                    <div className="sub-heading">- Let the AI Whip Up Magic</div>
                    <div className="content">
                        Using a blend of smart algorithms and culinary creativity, our AI whips up unique, well-balanced recipes in seconds. Its like having a personal chef with endless imagination.
                    </div>
                </div>
            </section>
            <form className="add-ingredient-form" action={handleSubmit}>
                <input
                    type="text"
                    aria-label="Add ingredients"
                    placeholder="e.g. oregano"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 && <IngredientsList ref={recipeSection} listOfIngredients={ingredients} onClick={handleClick} />}
            {recipe && <ClaudeRecipe generatedRecipe={recipe} />}
        </main>
    </>
}