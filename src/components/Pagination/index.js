import "./style.scss";

function Pagination({activePage, setActivePage, itemsPerPage, numItems}) {
    const pageNumbers = [...new Array(Math.ceil(numItems / itemsPerPage))].map((element, index) => index);
    return (
        <ul className="component-pagination">
            {pageNumbers.map(pageNumber => 
                <li key={pageNumber} className="component-pagination__item">
                    <button
                        className={`button ${activePage === pageNumber ? "button--active" : ""}`}
                        onClick={() => {
                            setActivePage(pageNumber);
                            window.scroll(0,0);
                        }}
                    >
                        {pageNumber + 1}
                    </button>
                </li>
            )}
        </ul>
    );
}

export default Pagination;