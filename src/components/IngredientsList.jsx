export default function IngredientsList(props) {
    const ingredientsList = props.listOfIngredients.map((item) => {
        return <li key={item}>{item}</li>
    })

    return <>
        <section className="ingredients-container">
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsList}</ul>
            {ingredientsList.length > 3 && <div className="get-recipe-container">
                <div ref={props.ref}>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button onClick={() => props.onClick()}>Get a recipe</button>
            </div>}
        </section>
    </>
}