// Simple authentication (replace with proper auth in production)
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "ibscience123" // Change this to a strong password
};

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        sessionStorage.setItem('adminAuthenticated', 'true');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadResources();
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('adminAuthenticated');
    location.reload();
});

// Check if already logged in
if (sessionStorage.getItem('adminAuthenticated')) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    document.addEventListener('DOMContentLoaded', loadResources);
}