export default function IngredientsList(props) {
    const ingredientsList = props.listOfIngredients.map((item, index) => {
        return (
            <>
                <div className="item" key={index}>
                    <li >{item}</li>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2ZHIDTj48-MPJgzYFgx0w7Bn5VbMSfbz-uA&s"
                        onClick={handleClick}
                        id={index}></img>
                </div>
            </>
        )
    })

    function handleClick(event) {
        props.removeIngredient(event.currentTarget.id);
    }

    return <>
        <section className="ingredients-container">
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsList}</ul>
            {ingredientsList.length > 3 && <div className="get-recipe-container">
                {props.recipe==="" ? 
                    <div ref={props.ref}>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div> : 
                    <div ref={props.ref}>
                        <h3>Didn't Like this one?</h3>
                        <p>Generate a new recipe from your list of ingredients.</p>
                    </div>
                }
                <button onClick={() => {props.onClick()}}>Get a recipe</button>
            </div>}
        </section>
    </>
}