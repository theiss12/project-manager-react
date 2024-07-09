const sendEmail = (address, body) => {
    console.log(`Message "${body}" was sent to ${address}`);
};

export const notifyContacts = (newProject, oldProject) => {
    const changedKeys = Object.keys(newProject).filter(key => newProject[key] !== oldProject[key]);
    const message = changedKeys.reduce((message, key) => message + `${key}: ${newProject[key]}\n`, "Changed project values are:\n");
    newProject.contacts.forEach(contact => sendEmail(contact.email, message));
};

export const refreshProjects = (setProjects) => {
    fetch('http://localhost:3201/api/projects')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => setProjects(data));
};

export const createProject = (name, description, status, contactIds, setProjects) => {
    fetch('http://localhost:3201/api/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
            status,
            contactIds
        }),
    })
        .then(() => refreshProjects(setProjects))
        .catch(error => console.error('Error:', error));

    // .then(response => response.json())
    // .then(data => refreshProjects(setProjects))
    // .catch(error => console.error('Error:', error));
};

export const updateProject = (projectId, name, description, status, contactIds, setProjects) => {
    fetch(`http://localhost:3201/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
            status,
            contactIds,
        }),
    })
        .then(() => refreshProjects(setProjects))
        .catch(error => console.error('Error:', error));
    // .then(response => response.json())
    // .then(data => console.log('Project updated:', data))
    // .catch(error => console.error('Error:', error));

};

export const deleteProject = (projectId, setProjects) => {
    fetch(`http://localhost:3201/api/projects/${projectId}`, {
        method: 'DELETE',
    })
        .then(() => refreshProjects(setProjects))
        .catch(error => console.error('Error:', error));
        // .then(response => response.json())
        // .then(data => console.log('Project deleted:', data))
        // .catch(error => console.error('Error:', error));

};

export const createContact = (name, email, setProjects) => {
    fetch('http://localhost:3201/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email
        }),
    })
        .then(() => refreshProjects(setProjects))
        .catch(error => console.error('Error:', error));
};

export const readContacts = (setter) => {
    fetch('http://localhost:3201/api/contacts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => setter(data));
}

export const updateContact = (contactId, name, email, setProjects) => {
    fetch(`http://localhost:3201/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email
        }),
    })
        .then(() => refreshProjects(setProjects))
        .catch(error => console.error('Error:', error));
};

export const deleteContact = (contactId, setProjects) => {
    fetch(`http://localhost:3201/api/contacts/${contactId}`, {
        method: 'DELETE',
    })
        .then(() => refreshProjects(setProjects))
        .catch(error => console.error('Error:', error));
};