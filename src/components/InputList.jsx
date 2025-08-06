export default function IngredientsList(props) {
    const ingredientsList = mapListItems(props.listOfIngredients, "ingredient");
    const moodList = mapListItems(props.listOfMoods, "mood");

    function mapListItems(list, type) {
        return list.map((item, index) => {
            const uniqueId = `${type}-${index}`
            return (
                <div className="item" key={index}>
                    <li >{item}</li>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2ZHIDTj48-MPJgzYFgx0w7Bn5VbMSfbz-uA&s"
                        onClick={handleClick}
                        id={uniqueId}></img>
                </div>
            )
        })
    }

    function handleClick(event) {
        const id = event.currentTarget.id;
        const index = parseInt(id.split("-")[1]);
        if (id.startsWith("ingredient")) {
            props.removeIngredient(index);
        }
        else {
            props.removeMood(index);
        }
    }

    return <>
        <section className="input-list-container">
            <div className="box">
                {ingredientsList.length > 0 && <div className="ingredients-container">
                    <h2>Ingredients on hand:</h2>
                    <ul className="ingredients-list" aria-live="polite">{ingredientsList}</ul>
                </div>}

                {moodList.length > 0 && <div className="mood-container">
                    <h2>Your Mood:</h2>
                    <ul className="mood-list" aria-live="polite">{moodList}</ul>
                </div>}

                {props.cuisine !== "" && <div className="cuisine-container">
                    <h2>Your Cuisine:</h2>
                    <div className="item">
                        {props.cuisine}
                    </div>
                </div>}
            </div>

            {(ingredientsList.length > 3 || moodList.length > 0 || props.cuisine!=="") && <div className="get-recipe-container">
                {props.recipe.length === 0 ?
                    <div ref={props.ref}>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div> :
                    <div ref={props.ref}>
                        <h3>Didn't Like this one?</h3>
                        <p>Generate a new recipe from your list of ingredients.</p>
                    </div>
                }
                <button onClick={() => { props.onClick() }}>Get a recipe</button>
            </div>}
        </section>
    </>
}