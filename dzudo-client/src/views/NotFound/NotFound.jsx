import "./notFound-style.css"

function NotFound() {
    console.debug('not');
    return (
        <div>
            <section className="error-container">
                <span>4</span>
                <span><span className="screen-reader-text">0</span></span>
                <span>4</span>
            </section>
            <p>
                <span className="big-text">
                    страница не найдена
                </span>
            </p>
        </div>
    )
}
export default NotFound