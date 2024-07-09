
import "./style.scss";
import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { ProjectsContext } from "../../providers/ProjectsProvider";
import { refreshProjects, deleteProject } from "../../services/api";
import Pagination from "../../components/Pagination";

function Home() {
    const {projects, setProjects} = useContext(ProjectsContext);
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const filterRef = useRef(null);

    useEffect(() => {
        refreshProjects(setProjects);
    }, []);

    useEffect(() => {
        filterProjects(filterRef.current.value);
    }, [projects]);

    useEffect(() => {
        // reset pagination if slice starts off the filtered projects array
        if (activePage * itemsPerPage >= filteredProjects.length) {
            setActivePage(0);
        }
    }, [filteredProjects]);

    const filterProjects = filterValue => {
        if (filterValue === "any") {
            setFilteredProjects(projects);
            return;
        }
        const newFilteredProjects = projects.filter(project => project.status === filterValue);
        setFilteredProjects(newFilteredProjects);
    };

    const stopPopIn = animationEndEvent => {
        animationEndEvent.target.classList.toggle("popping-in");
    }

    return(
        <section className="screen-home">
            <div className="container">
                <h1 className="screen-home__title">
                    <span className="title-line"></span>
                    Projects
                    <span className="title-line"></span>
                </h1>
                <div className="filter">
                    <h2 className="filter__title">
                        Filter by status:
                    </h2>
                    <select
                        className="filter__select"
                        onChange={changeEvent => {
                            filterProjects(changeEvent.target.value)
                        }}
                        ref={filterRef}
                    >
                        <option>any</option>
                        <option>hold</option>
                        <option>ongoing</option>
                        <option>done</option>
                    </select>
                </div>
                <div className="screen-home__project-grid">
                    {filteredProjects.slice(activePage * itemsPerPage, activePage * itemsPerPage + itemsPerPage).map(project =>
                        <div
                            key={project.id}
                            className="project popping-in"
                            onAnimationEnd={stopPopIn}
                        >
                            <p className="project__id">
                                #{project.id}
                            </p>
                            <h2 className="project__name">
                                {project.name}
                            </h2>
                            <p className="project__description">
                                {project.description}
                            </p>
                            {project.contacts.length && 
                            <div className="project__amount">
                                <p className="project__amount-display">
                                    {project.contacts.length} contact{project.contacts.length === 1 ? "" : "s"}
                                </p>
                                <ul className="project__contacts">
                                    {project.contacts.map(contact => 
                                        <li key={contact.id} className="project__contact">
                                            <b>{contact.name}</b> - {contact.email}
                                        </li>
                                    )}
                                </ul>
                            </div>}
                            <p className={`project__status project__status--${project.status}`}>
                                {project.status}
                            </p>
                            <div className="project__control">
                                <Link
                                    to={`/editor/${project.id}`}
                                    className="button"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="button"
                                    onClick={() => {
                                        deleteProject(project.id, setProjects);
                                        refreshProjects(setProjects);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                    <div
                        className="project popping-in project--new"
                        onAnimationEnd={stopPopIn}
                    >
                        <Link to={"editor/new"}>+</Link>
                    </div>
                </div>
                {filteredProjects.length > itemsPerPage && 
                <Pagination
                    activePage={activePage}
                    setActivePage={setActivePage}
                    itemsPerPage={itemsPerPage}
                    numItems={filteredProjects.length}
                />}
            </div>
        </section>
    );
}

export default Home;