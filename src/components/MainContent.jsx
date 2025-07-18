import React, { useEffect } from "react"
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromMistral } from "../ai"

export default function () {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const loadingSection = React.useRef(null);
    const recipeSection = React.useRef(null);
    const noOfIngredients = React.useRef(null);

    useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            const yCoord = recipeSection.current.getBoundingClientRect().top + window.scrollY - 80
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
        if (ingredients.length <= 3 && recipe === "") {
            const yCoord = noOfIngredients.current.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
        else if (ingredients.length >= 4 && recipe === "") {
            const yCoord = recipeSection.current.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
        if (loading) {
            const yCoord = loadingSection.current.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
    }, [recipe, ingredients, loading])

    function handleSubmit(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    }

    async function handleClick() {
        setLoading(true);
        const recipeMarkdown = await getRecipeFromMistral(ingredients);
        setRecipe(recipeMarkdown);
        setLoading(false);
    }

    function removeIngredient(index) {
        const newIngredientList = ingredients.filter((item) => item !== ingredients[index]);
        setIngredients(newIngredientList);
        setRecipe("");
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
                    list="ingredient-list"
                    aria-label="Add ingredients"
                    placeholder="e.g. onion"
                    name="ingredient"
                />
                <datalist id="ingredient-list">
                    <option value="Tomato"></option>
                    <option value="Potato"></option>
                    <option value="Paneer"></option>
                    <option value="All main spices"></option>
                    <option value="Onion"></option>
                    <option value="Garlic"></option>
                    <option value="Chicken"></option>
                </datalist>
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ref={recipeSection}
                    listOfIngredients={ingredients}
                    onClick={handleClick}
                    removeIngredient={removeIngredient}
                    recipe = {recipe}
                />}
            {ingredients.length <= 3 && <h4 ref={noOfIngredients}>Add {4 - ingredients.length} more ingredients to start making a recipe</h4>}
            {(recipe !== "" || loading) && <ClaudeRecipe generatedRecipe={recipe} loading={loading} ref={loadingSection} />}
        </main>
    </>
}