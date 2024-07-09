import "./style.scss";
import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProjectsContext } from "../../providers/ProjectsProvider";
import { createContact, readContacts, updateContact, deleteContact, refreshProjects, updateProject, createProject, notifyContacts } from "../../services/api";

function Editor() {
    const { projects, setProjects } = useContext(ProjectsContext);
    const { slug } = useParams();
    const navigate = useNavigate();

    const getProjectById = id => {
        let result = projects.find(project => project.id == id);
        if (!result) {
            result = {
                id: -1,
                name: "",
                description: "",
                status: "hold",
                contacts: []
            };
        };
        return { ...result };
    };

    const [currentProject, setCurrentProject] = useState(getProjectById(slug));

    const [contacts, setContacts] = useState([]);

    const [newContact, setNewContact] = useState({ name: "", email: "" });
    const [newContactSelectValue, setNewContactSelectValue] = useState("New");

    useEffect(() => {   // when component mounts
        refreshProjects(setProjects);
        readContacts(setContacts);
    }, []);

    useEffect(() => {
        setCurrentProject(getProjectById(slug));
    }, [slug]);

    useEffect(() => {
        readContacts(setContacts);
        setCurrentProject(getProjectById(slug));
        setNewContact({ name: "", email: "" })
        setNewContactSelectValue("New");
    }, [projects]);

    const updateCurrentProject = (event, property) => {
        setCurrentProject({ ...currentProject, [property]: event.target.value });
    };

    const getContactEmailByName = name => {
        const contactFound = contacts.find(contact => contact.name === name);
        return contactFound ? contactFound.email : "";
    };

    const isFormFilled = () => {
        return (
            currentProject.contacts.length !== 0 &&
            currentProject.name !== "" &&
            currentProject.description !== "" &&
            currentProject.status !== ""
        );
    };

    return (
        <section className="screen-editor">
            <div className="container">
                <h2 className="screen-editor__title">
                    Edit Project
                </h2>
                <div className="project">
                    <h3 className="project__id">
                        {currentProject.id < 0 ? "New" : "#" + currentProject.id}
                    </h3>
                    <p className="screen-editor__input">
                        <label>Name</label>
                        <input
                            type="text"
                            className="project__name"
                            value={currentProject.name}
                            onChange={changeEvent => { updateCurrentProject(changeEvent, "name") }}
                        />
                    </p>
                    <p className="screen-editor__input">
                        <label>Description</label>
                        <input
                            type="text"
                            className="project__description"
                            value={currentProject.description}
                            onChange={changeEvent => { updateCurrentProject(changeEvent, "description") }}
                        />
                    </p>
                    <p className="screen-editor__input">
                        <label>Status</label>
                        <select
                            className="project__status"
                            value={currentProject.status}
                            onChange={changeEvent => { updateCurrentProject(changeEvent, "status") }}
                        >
                            <option>hold</option>
                            <option>ongoing</option>
                            <option>done</option>
                        </select>
                    </p>
                    <h3 className="project__contacts-title">Bound Contacts</h3>
                    <ul className="project__contacts">
                        {currentProject.contacts.map(contact =>
                            <li key={contact.id} className="project__contacts-item">
                                <b>{contact.name}</b>{contact.email}
                                <button
                                    className="button"
                                    onClick={() => {
                                        const filteredContacts = currentProject.contacts.filter(filterContact => filterContact.id !== contact.id)
                                        setCurrentProject({
                                            ...currentProject,
                                            contacts: filteredContacts
                                        })
                                    }}
                                >
                                    Unbind
                                </button>
                            </li>
                        )}
                        <li className="project__contacts-item">
                            <select
                                className="project__contact-select"
                                onChange={changeEvent => setNewContactSelectValue(changeEvent.target.value)}
                                value={newContactSelectValue}
                            >
                                <option>
                                    <b>New</b>
                                </option>
                                {contacts.map(contact =>
                                    <option key={contact.id}>
                                        {contact.name}
                                    </option>
                                )}
                            </select>
                            <span>
                                {getContactEmailByName(newContactSelectValue)}
                            </span>
                            {newContactSelectValue !== "New" ? 
                            <div className="input-container--old-contact">
                                <button
                                    className="button"
                                    onClick={() => {
                                        const newContact = contacts.find(contact => contact.name === newContactSelectValue);
                                        const existing = currentProject.contacts.find(contact => contact.name === newContactSelectValue)
                                        if (existing) return;
                                        setCurrentProject({
                                            ...currentProject,
                                            contacts: [
                                                ...currentProject.contacts,
                                                newContact
                                            ]
                                        })
                                    }}
                                >
                                    Bind
                                </button>
                                <button
                                    className="button"
                                    onClick={() => {
                                        const contactToDelete = contacts.find(contact => contact.name === newContactSelectValue);
                                        deleteContact(contactToDelete.id, setProjects);
                                    }}
                                >
                                    Drop
                                </button>
                            </div> :
                            <div className="input-container--new-contact">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="new-contact__name"
                                    value={newContact.name}
                                    onChange={changeEvent => { setNewContact({ ...newContact, name: changeEvent.target.value }) }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="new-contact__email"
                                    value={newContact.email}
                                    onChange={changeEvent => { setNewContact({ ...newContact, email: changeEvent.target.value }) }}
                                />
                                <button
                                    className="button"
                                    onClick={() => {
                                        const existing = contacts.find(contact => contact.name === newContact.name);
                                        if (existing) {
                                            updateContact(existing.id, existing.name, newContact.email, setProjects);
                                            return;
                                        }
                                        if (!!newContact.name && !!newContact.email) {
                                            createContact(newContact.name, newContact.email, setProjects);
                                        }
                                    }}
                                    disabled={!(!!newContact.name && !!newContact.email)}
                                >
                                    Create
                                </button>
                            </div>}
                        </li>
                    </ul>
                </div>
                <div className="screen-editor__navigation">
                    <Link to="/" className="button button--cancel">Cancel</Link>
                    <button
                        className="button button--save"
                        disabled={!isFormFilled()}
                        onClick={() => {
                            if (!isFormFilled()) return;
                            const contactIds = currentProject.contacts.map(contact => contact.id);
                            if (currentProject.id === -1) {
                                createProject(
                                    currentProject.name,
                                    currentProject.description,
                                    currentProject.status,
                                    contactIds,
                                    setProjects
                                );
                                navigate("../");
                                return;
                            }
                            updateProject(
                                currentProject.id,
                                currentProject.name,
                                currentProject.description,
                                currentProject.status,
                                contactIds,
                                setProjects
                            );
                            notifyContacts(
                                currentProject,
                                getProjectById(slug)
                            );
                            navigate("../");
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Editor;