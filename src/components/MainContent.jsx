import React, { useEffect } from "react"
import IngredientsList from "./InputList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromIngredients, getRecipeFromMood, getRecipeFromMoodAndIngredients, getRecipeFromCuisine } from "../getRecipeFromAI"
import { changeRecipe } from "../changeRecipe";

export default function () {
    const [ingredients, setIngredients] = React.useState([]);
    const [mood, setMood] = React.useState([]);
    const [cuisine, setCuisine] = React.useState("");
    const [recipeList, setRecipeList] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const loadingSection = React.useRef(null);
    const recipeSection = React.useRef(null);
    const changedRecipe = React.useRef(null);
    const noOfIngredients = React.useRef(null);

    useEffect(() => {
        if (recipeList.length !== 0 && recipeList.length <= 1 && recipeSection.current !== null) {
            const yCoord = recipeSection.current.getBoundingClientRect().top + window.scrollY - 80
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
        if (recipeList.length > 1 && changedRecipe.current !== null) {
            const yCoord = changedRecipe.current.getBoundingClientRect().top + window.scrollY - 80
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
        if (ingredients.length <= 3 && recipeList.length === 0) {
            const yCoord = noOfIngredients.current.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
        else if (ingredients.length >= 4 && recipeList.length === 0) {
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
    }, [recipeList, ingredients, loading, mood, cuisine])

    function handleSubmit(formData) {
        const newMood = formData.get("mood");
        if (newMood !== "") {
            setMood(prevMood => [...prevMood, newMood]);
        }
        const newIngredient = formData.get("ingredient");
        if (newIngredient !== "") {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
        }
        const newCuisine = formData.get("cuisine");
        if (newCuisine !== "") {
            setCuisine(newCuisine);
        }
        setRecipeList([]);
    }

    function handleComment(formData) {
        const newComment = formData.get("comment");
        if (newComment !== "") {
            handleClick(newComment);
        }
    }

    async function handleClick(newComment) {
        setLoading(true);
        let recipeMarkdown = "";
        if (newComment !== undefined) {
            try {
                recipeMarkdown = await changeRecipe(recipeList[recipeList.length - 1], newComment);
                setError(false);
            } catch (err) {
                setError(true);
            }

        }
        else if (mood.length === 0) {
            try {
                recipeMarkdown = await getRecipeFromIngredients(ingredients, cuisine);
                setError(false);
            }
            catch (err) {
                setError(true);
            }
        }
        else if (ingredients.length === 0) {
            try {
                recipeMarkdown = await getRecipeFromMood(mood, cuisine);
                setError(false);
            }
            catch (err) {
                setError(true);
            }
        }
        else if (mood.length === 0 && ingredients.length === 0) {
            try {
                recipeMarkdown = await getRecipeFromCuisine(cuisine);
                setError(false);
            }
            catch (err) {
                setError(true);
            }
        }
        else {
            try {
                recipeMarkdown = await getRecipeFromMoodAndIngredients(mood, ingredients, cuisine);
                setError(false);
            }
            catch (err) {
                setError(true);
            }
        }
        setRecipeList(prev => [...prev, recipeMarkdown]);
        setLoading(false);
    }

    function removeIngredient(index) {
        const newIngredientList = ingredients.filter((item) => item !== ingredients[index]);
        setIngredients(newIngredientList);
        setRecipeList([]);
    }

    function removeMood(index) {
        const newMood = mood.filter((item) => item !== mood[index]);
        setMood(newMood);
        setRecipeList([]);
    }

    return <>
        <main>
            <section className="description">
                <div className="heading">Recipes That Match Your Vibe!</div>
                <div className="text">
                    <div className="content">
                        Craving comfort food on a rainy day? Feeling adventurous with a handful of exotic spices? Our smart recipe generator blends your ingredients, mood, and preferred cuisine into one delicious plan. Here's how the magic happens:
                    </div>
                    <div className="sub-heading">- Share Your Pantry + Mood</div>
                    <div className="content">
                        Pop in the ingredients you have got on hand, or tell us what you want , spicy, vegan, indulgent, healthy—and choose a cuisine that excites you.
                    </div>
                    <div className="sub-heading">- AI in Apron Mode</div>
                    <div className="content">
                        Our AI analyzes flavor profiles, cooking techniques, and your vibe to cook up recipes that feel tailor-made—whether it is a soothing bowl of dal or a feisty fusion taco.
                    </div>
                </div>
            </section>
            <form className="add-content-form" action={handleSubmit}>
                <div className="ingredient-input">
                    <input
                        type="text"
                        list="ingredient-list"
                        aria-label="Add ingredients"
                        placeholder="e.g. Onion"
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
                </div>

                <div className="mood-input">
                    <input
                        type="text"
                        list="moods"
                        aria-label="What's your mood"
                        placeholder="e.g. Spicy"
                        name="mood"
                    />
                    <datalist id="moods">
                        <option value="Gluten-Free"></option>
                        <option value="Sweet Cravings"></option>
                        <option value="Spicy"></option>
                        <option value="Vegan"></option>
                        <option value="Low-carb"></option>
                        <option value="Indulgent"></option>
                        <option value="Healthy"></option>
                        <option value="High-Protein"></option>
                    </datalist>
                    <button>Add mood</button>
                </div>

                <div className="cuisine-input">
                    <input
                        type="text"
                        list="cuisines"
                        aria-label="Select Cuisine"
                        placeholder="e.g. Chinese"
                        name="cuisine"
                    />
                    <datalist id="cuisines">
                        <option value="Italian"></option>
                        <option value="Indian"></option>
                        <option value="Mexican"></option>
                        <option value="Chinese"></option>
                        <option value="Thai"></option>
                        <option value="Japanese"></option>
                        <option value="French"></option>
                    </datalist>
                    <button>{cuisine === "" ? "+ Add cuisine" : "Change Cuisine"}</button>
                </div>
            </form>

            {mood.length > 0 ?
                <h4 ref={noOfIngredients}>
                    Get a recipe now {ingredients.length < 4 && `or Add ${4 - ingredients.length} ingredients`}
                </h4>
                : 
                (ingredients.length <= 3 && ingredients.length > 0) ?
                    <h4 ref={noOfIngredients}>
                        Add {4 - ingredients.length} more ingredients to get a recipe now
                    </h4>
                : 
                ingredients.length >= 4 ?
                    <h4 ref={noOfIngredients}>
                        Click "Get a recipe" now
                    </h4>
                : 
                cuisine === "" ?
                    <h4 ref={noOfIngredients}>
                        Select a cuisine to start with!
                    </h4>
                :
                <h4 ref={noOfIngredients}>
                    Add your mood or ingredients if you want
                </h4>
            }

            {(ingredients.length > 0 || mood.length > 0 || cuisine !== "") &&
                <IngredientsList
                    ref={recipeSection}
                    listOfIngredients={ingredients}
                    listOfMoods={mood}
                    cuisine={cuisine}
                    onClick={handleClick}
                    removeIngredient={removeIngredient}
                    removeMood={removeMood}
                    recipe={recipeList}
                />
            }

            {recipeList.length !== 0 ? recipeList.map((r, index) => (
                <ClaudeRecipe
                    key={index}
                    generatedRecipe={r}
                    error = {error}
                    loading={loading}
                    ref1={changedRecipe}
                    ref2={loadingSection}
                />
            )) : <ClaudeRecipe
                generatedRecipe={null}
                loading={loading}
                error = {error}
                ref1={changedRecipe}
                ref2={loadingSection}
            />}


            {(recipeList.length !== 0 && !loading) ? <div className="change-recipe">
                <h4>
                    Tell us what’s missing or what you’d like to change:
                </h4>
                <form className="add-comment-form" action={handleComment}>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder='e.g. Make it spicier'
                        name='comment'
                    />
                    <button>Get a new recipe</button>
                </form>
            </div> : null}
        </main>
    </>
}