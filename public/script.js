
let allEmojis = [];
let currentCategory = 'all';

// Load emojis when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadEmojis();
    setupEventListeners();
});

async function loadEmojis() {
    try {
        const response = await fetch('/api/emojis');
        allEmojis = await response.json();
        document.getElementById('loading').style.display = 'none';
        displayEmojis(filterEmojis());
    } catch (error) {
        console.error('Error loading emojis:', error);
        document.getElementById('loading').innerHTML = 'Failed to load emojis. Please try again.';
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
}

function handleSearch() {
    displayEmojis(filterEmojis());
}

function handleFilter(event) {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update current category
    currentCategory = event.target.dataset.category;
    
    // Display filtered emojis
    displayEmojis(filterEmojis());
}

function filterEmojis() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allEmojis;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(emoji => 
            emoji.category.toLowerCase().includes(currentCategory.toLowerCase())
        );
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(emoji => 
            emoji.name.toLowerCase().includes(searchTerm) ||
            emoji.category.toLowerCase().includes(searchTerm)
        );
    }
    
    return filtered;
}

function displayEmojis(emojis) {
    const grid = document.getElementById('emojiGrid');
    grid.innerHTML = '';
    
    if (emojis.length === 0) {
        grid.innerHTML = '<div class="no-results">No emojis found 😢</div>';
        return;
    }
    
    emojis.slice(0, 100).forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'emoji-card';
        card.innerHTML = `
            <div class="emoji">${emoji.htmlCode ? emoji.htmlCode.join('') : '🤔'}</div>
            <div class="emoji-name">${emoji.name}</div>
            <div class="emoji-category">${emoji.category}</div>
        `;
        
        // Add click to copy functionality
        card.addEventListener('click', () => copyEmoji(emoji));
        
        grid.appendChild(card);
    });
}

function copyEmoji(emoji) {
    const emojiText = emoji.htmlCode ? emoji.htmlCode.join('') : '🤔';
    navigator.clipboard.writeText(emojiText).then(() => {
        showCopyNotification(emojiText);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showCopyNotification(emoji) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `${emoji} copied!`;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
}
