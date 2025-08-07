import ReactMarkdown from 'react-markdown';

export default function ClaudeRecipe(props) {
    console.log(props.error);
    return <>
        <section>
            {props.generatedRecipe !== null &&
                <>
                    <div className="recipe" ref={props.ref1}>
                        <h2>Chef Claude Recommends:</h2>
                        <article className="suggested-recipe-container" aria-live="polite">
                            <ReactMarkdown>{props.generatedRecipe}</ReactMarkdown>
                        </article>
                    </div>
                    <div className="chats">
                        {props.chatHistory.map((item,idx)=>{
                            <span key={idx}>{item}</span>
                        })}
                    </div>
                </>
            }
            {props.loading &&
                <div className="loading" ref={props.ref2}>
                    <img
                        src="https://mir-s3-cdn-cf.behance.net/project_modules/hd/beb24c92785487.5e5453d643daa.gif"
                    ></img>
                    <h4 className='shimmer-text'>Chef Claude is cooking for you.....</h4>
                </div>
            }
            {props.error &&
                <div className="error-block" role="alert">
                    <h3>Oops! Something went wrong 😓</h3>
                    <p>We're having trouble fetching a recipe right now. Please try again later.</p>
                </div>
            }
        </section>
    </>
}