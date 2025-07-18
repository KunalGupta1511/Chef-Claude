import ReactMarkdown from 'react-markdown'

export default function ClaudeRecipe(props) {
    return <>
        <section>
            {props.loading ? 
                <div className="loading" ref={props.ref}>
                    <img
                        src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/beb24c92785487.5e5453d643daa.gif"
                    ></img>
                    <h4 className='shimmer-text'>Chef Claude is cooking for you.....</h4>
                </div> :
                <div className="recipe">
                    <h2>Chef Claude Recommends:</h2>
                    <article className="suggested-recipe-container" aria-live="polite">
                        <ReactMarkdown>{props.generatedRecipe}</ReactMarkdown>
                    </article>
                </div>
            }

        </section>
    </>
}