function loadResources() {
    // In a real app, this would fetch from a database
    // For now we'll use localStorage
    let resources = JSON.parse(localStorage.getItem('resources')) || [];
    
    const resourceList = document.getElementById('resource-list');
    resourceList.innerHTML = '';
    
    resources.forEach((resource, index) => {
        const resourceElement = document.createElement('div');
        resourceElement.className = 'resource-item';
        resourceElement.innerHTML = `
            <h3>${resource.name}</h3>
            <p>${resource.description}</p>
            <p>Price: $${resource.price.toFixed(2)}</p>
            <button class="btn delete-btn" data-id="${index}">Delete</button>
        `;
        resourceList.appendChild(resourceElement);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-id');
            deleteResource(index);
        });
    });
}

function deleteResource(index) {
    let resources = JSON.parse(localStorage.getItem('resources')) || [];
    resources.splice(index, 1);
    localStorage.setItem('resources', JSON.stringify(resources));
    loadResources();
}

document.getElementById('add-resource-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newResource = {
        name: document.getElementById('resource-name').value,
        description: document.getElementById('resource-desc').value,
        price: parseFloat(document.getElementById('resource-price').value),
        preview: document.getElementById('resource-preview').value || 'https://via.placeholder.com/300x200'
    };
    
    let resources = JSON.parse(localStorage.getItem('resources')) || [];
    resources.push(newResource);
    localStorage.setItem('resources', JSON.stringify(resources));
    
    // Clear form
    this.reset();
    loadResources();
});