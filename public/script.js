let allEmojis = [];
let currentCategory = 'all';

// Загружаем эмодзи при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadEmojis();
    setupEventListeners();
});

async function loadEmojis() {
    try {
        const response = await fetch(`${window.location.origin}/api/emojis`);
        allEmojis = await response.json();
        document.getElementById('loading').style.display = 'none';
        displayEmojis(filterEmojis());
    } catch (error) {
        console.error('Error loading emojis:', error);
        document.getElementById('loading').innerHTML = 'Failed to load emojis. Please try again.';
    }
}

async function searchEmojis(query) {
    try {
        const response = await fetch(`${window.location.origin}/api/emojis/search?q=${encodeURIComponent(query)}`);
        return await response.json();
    } catch (error) {
        console.error('Error searching emojis:', error);
        return [];
    }
}

async function fetchEmojisByCategory(category) {
    try {
        const response = await fetch(`${window.location.origin}/api/emojis/category/${category}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching emojis by category:', error);
        return [];
    }
}

function setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Фильтры
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
}

function handleSearch() {
    displayEmojis(filterEmojis());
}

function handleFilter(event) {
    // Убираем active у всех кнопок
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

    // Добавляем active на выбранную
    event.target.classList.add('active');

    // Обновляем категорию
    currentCategory = event.target.dataset.category;

    // Фильтруем эмодзи
    displayEmojis(filterEmojis());
}

function filterEmojis() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allEmojis;

    // Фильтр по категории
    if (currentCategory !== 'all') {
        filtered = filtered.filter(emoji =>
            emoji.category.toLowerCase().includes(currentCategory.toLowerCase())
        );
    }

    // Фильтр по поиску
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

        // Декодируем htmlCode в смайлы
        let displayEmoji = '🤔';
        if (emoji.htmlCode && emoji.htmlCode.length > 0) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = emoji.htmlCode.join('');
            displayEmoji = tempDiv.textContent || tempDiv.innerText || '🤔';
        }

        card.innerHTML = `
            <div class="emoji">${displayEmoji}</div>
            <div class="emoji-name">${emoji.name}</div>
            <div class="emoji-category">${emoji.category}</div>
        `;

        // Копирование в буфер
        card.addEventListener('click', () => copyEmoji(emoji));

        grid.appendChild(card);
    });
}

function copyEmoji(emoji) {
    let emojiText = '🤔'; // fallback
    if (emoji.htmlCode && emoji.htmlCode.length > 0) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = emoji.htmlCode.join('');
        emojiText = tempDiv.textContent || tempDiv.innerText || '🤔';
    }

    navigator.clipboard.writeText(emojiText).then(() => {
        showCopyNotification(emojiText);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showCopyNotification(emoji) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.innerHTML = `${emoji} copied!`;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
}
