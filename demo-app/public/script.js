// demo-app/public/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Form handling
    const form = document.getElementById('registration-form');
    const resultDiv = document.getElementById('form-result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        
        document.getElementById('result-username').textContent = username;
        document.getElementById('result-email').textContent = email;
        
        resultDiv.classList.remove('hidden');
        
        // Scroll to results
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Dynamic content loading
    const loadDataBtn = document.getElementById('load-data-btn');
    const dataContainer = document.getElementById('data-container');
    
    loadDataBtn.addEventListener('click', function() {
        dataContainer.innerHTML = '<p>Loading...</p>';
        
        // Simulate async data loading
        setTimeout(function() {
            dataContainer.innerHTML = `
                <h3>Loaded Data</h3>
                <ul>
                    <li>User: john_doe</li>
                    <li>Email: john@example.com</li>
                    <li>Status: Active</li>
                    <li>Last Login: Today</li>
                </ul>
            `;
        }, 1500);
    });
    
    // Counter functionality
    const countElement = document.getElementById('count');
    const incrementBtn = document.getElementById('increment-btn');
    const decrementBtn = document.getElementById('decrement-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    let count = 0;
    
    incrementBtn.addEventListener('click', function() {
        count++;
        countElement.textContent = count;
    });
    
    decrementBtn.addEventListener('click', function() {
        count--;
        countElement.textContent = count;
    });
    
    resetBtn.addEventListener('click', function() {
        count = 0;
        countElement.textContent = count;
    });
    
    // Hidden content functionality
    const showHiddenBtn = document.getElementById('show-hidden-btn');
    const hiddenContent = document.getElementById('hidden-content');
    
    showHiddenBtn.addEventListener('click', function() {
        hiddenContent.classList.remove('hidden');
    });
    
    // Add some delay for demonstrating loading states
    setTimeout(function() {
        // This could be used to trigger animations or other effects
    }, 1000);
});