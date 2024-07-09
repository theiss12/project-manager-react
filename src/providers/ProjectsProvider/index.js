import { createContext, useState,  } from "react";

export const ProjectsContext = createContext();

const ProjectsProvider = (props) => {
    const [projects, setProjects] = useState([]);

    return (
        <ProjectsContext.Provider value={{ projects, setProjects }}>
            {props.children}
        </ProjectsContext.Provider>
    )
};

export default ProjectsProvider;