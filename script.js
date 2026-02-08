/**
 * Date Night Planner
 * Plan the perfect evening with personalized recommendations
 */

const activityPreferences = [
    { id: 'dinner', icon: '🍽️', label: 'Dinner' },
    { id: 'movie', icon: '🎬', label: 'Movie' },
    { id: 'theater', icon: '🎭', label: 'Theater' },
    { id: 'concert', icon: '🎵', label: 'Concert' },
    { id: 'museum', icon: '🏛️', label: 'Museum' },
    { id: 'park', icon: '🌳', label: 'Park Walk' },
    { id: 'bar', icon: '🍷', label: 'Wine Bar' },
    { id: 'coffee', icon: '☕', label: 'Coffee Shop' },
    { id: 'cooking', icon: '👨‍🍳', label: 'Cooking Class' },
    { id: 'sports', icon: '⛳', label: 'Sports Activity' },
    { id: 'dancing', icon: '💃', label: 'Dancing' },
    { id: 'arcade', icon: '🎮', label: 'Arcade/Games' },
    { id: 'beach', icon: '🏖️', label: 'Beach' },
    { id: 'hiking', icon: '⛰️', label: 'Hiking' },
    { id: 'shopping', icon: '🛍️', label: 'Shopping' },
    { id: 'spa', icon: '💆', label: 'Spa' }
];

const dateTypeTemplates = {
    'first-date': {
        suggestions: ['coffee', 'dinner', 'park', 'museum'],
        tips: [
            'Choose a public, comfortable location',
            'Keep it light and fun - 2-3 hours is ideal',
            'Have conversation topics ready',
            'Pick a spot with easy parking or transit access'
        ]
    },
    'casual': {
        suggestions: ['coffee', 'movie', 'park', 'arcade'],
        tips: [
            'Focus on activities that encourage interaction',
            'Keep it relaxed and low-pressure',
            'Try something new together',
            'Be flexible with timing'
        ]
    },
    'romantic': {
        suggestions: ['dinner', 'theater', 'bar', 'beach'],
        tips: [
            'Choose intimate settings with good ambiance',
            'Make reservations in advance',
            'Consider sunset timing for outdoor activities',
            'Add personal touches like flowers or a handwritten note'
        ]
    },
    'anniversary': {
        suggestions: ['dinner', 'theater', 'spa', 'concert'],
        tips: [
            'Recreate your first date or a special memory',
            'Book special upgrades or VIP experiences',
            'Prepare a thoughtful gift or surprise',
            'Choose meaningful locations'
        ]
    },
    'adventure': {
        suggestions: ['hiking', 'sports', 'cooking', 'dancing'],
        tips: [
            'Try something neither of you have done before',
            'Build in time for spontaneity',
            'Bring a sense of humor',
            'Capture memories with photos'
        ]
    }
};

let selectedActivities = [];
let dateData = {};

function init() {
    renderPreferences();
    setupEventListeners();
    setDefaultDateTime();
}

function setDefaultDateTime() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(19, 0, 0, 0);
    const dateTimeStr = now.toISOString().slice(0, 16);
    document.getElementById('dateTime').value = dateTimeStr;
}

function renderPreferences() {
    const grid = document.getElementById('datePreferencesGrid');
    grid.innerHTML = activityPreferences.map(pref => `
        <div class="preference-card" data-id="${pref.id}">
            <div class="preference-icon">${pref.icon}</div>
            <div class="preference-label">${pref.label}</div>
        </div>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('datePreferencesGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.preference-card');
        if (card) {
            const id = card.dataset.id;
            card.classList.toggle('selected');
            
            if (selectedActivities.includes(id)) {
                selectedActivities = selectedActivities.filter(i => i !== id);
            } else {
                selectedActivities.push(id);
            }
        }
    });

    document.getElementById('dateNightBtn').addEventListener('click', planDateNight);
    document.getElementById('dateNightResetBtn').addEventListener('click', resetForm);
}

function planDateNight() {
    dateData = {
        type: document.getElementById('dateType').value,
        dateTime: document.getElementById('dateTime').value,
        budget: document.getElementById('budget').value,
        location: document.getElementById('dateLocation').value,
        atmosphere: document.getElementById('atmosphere').value,
        transportation: document.getElementById('transportation').value,
        duration: document.getElementById('duration').value,
        dressCode: document.getElementById('dressCode').value,
        activities: selectedActivities
    };

    if (!dateData.budget || !dateData.location) {
        alert('Please fill in budget and location');
        return;
    }

    if (selectedActivities.length === 0) {
        alert('Please select at least one activity preference');
        return;
    }

    generateItinerary();
}

function generateItinerary() {
    const content = document.getElementById('dateItineraryContent');
    const dateTime = new Date(dateData.dateTime);
    const template = dateTypeTemplates[dateData.type];
    
    // Create itinerary items
    const selectedActivitiesData = activityPreferences.filter(a => 
        selectedActivities.includes(a.id)
    );
    
    let currentTime = new Date(dateTime);
    let itineraryHTML = '';
    
    // Generate 2-3 activities based on duration
    const numActivities = dateData.duration === 'full-day' ? 3 : 
                         dateData.duration === '4-6' ? 3 : 2;
    
    for (let i = 0; i < Math.min(numActivities, selectedActivitiesData.length); i++) {
        const activity = selectedActivitiesData[i];
        const timeStr = currentTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
        
        itineraryHTML += `
            <div class="itinerary-item">
                <div class="itinerary-time">${timeStr}</div>
                <div class="itinerary-activity">${activity.icon} ${activity.label}</div>
                <div class="itinerary-description">
                    ${getActivityDescription(activity.id, dateData.type)}
                </div>
                <div class="itinerary-details">
                    <span>📍 ${dateData.location}</span>
                    <span>💰 Budget: $${Math.round(dateData.budget / numActivities)}</span>
                    <span>👔 ${capitalize(dateData.dressCode)}</span>
                </div>
            </div>
        `;
        
        // Increment time by 1.5-2 hours
        currentTime.setHours(currentTime.getHours() + 2);
    }
    
    // Add tips
    const tipsHTML = `
        <div class="date-tips">
            <h3>💡 Tips for Your ${capitalize(dateData.type.replace('-', ' '))}</h3>
            <ul>
                ${template.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
    
    content.innerHTML = itineraryHTML + tipsHTML;
    
    document.getElementById('dateNightResults').classList.remove('hidden');
    document.getElementById('dateNightResults').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function getActivityDescription(activityId, dateType) {
    const descriptions = {
        'dinner': `Enjoy a delicious meal at a ${dateType === 'romantic' ? 'romantic' : 'nice'} restaurant. Consider making a reservation in advance.`,
        'movie': 'Catch the latest film or a classic at your local cinema. Arrive early for good seats!',
        'theater': 'Experience live entertainment with a theater performance or musical.',
        'concert': 'Enjoy live music from your favorite artists or discover new performers.',
        'museum': 'Explore art, history, or science exhibits at a local museum.',
        'park': 'Take a leisurely stroll through a scenic park or garden.',
        'bar': 'Relax with craft cocktails or fine wine in a cozy atmosphere.',
        'coffee': 'Connect over artisan coffee in a charming café setting.',
        'cooking': 'Learn new culinary skills together in a hands-on cooking class.',
        'sports': 'Get active with mini-golf, bowling, or another fun sport activity.',
        'dancing': 'Hit the dance floor or take a beginner dance lesson together.',
        'arcade': 'Compete in classic and modern games at an arcade or game bar.',
        'beach': 'Watch the sunset and enjoy the ocean breeze at the beach.',
        'hiking': 'Explore nature trails and enjoy scenic views on a hike.',
        'shopping': 'Browse boutiques, markets, or unique shops in a fun neighborhood.',
        'spa': 'Relax and unwind with couples massage or spa treatments.'
    };
    
    return descriptions[activityId] || 'Enjoy quality time together with this activity.';
}

function capitalize(str) {
    if (!str) return '';
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function resetForm() {
    selectedActivities = [];
    dateData = {};
    
    document.getElementById('dateType').value = 'first-date';
    setDefaultDateTime();
    document.getElementById('budget').value = '';
    document.getElementById('dateLocation').value = '';
    document.getElementById('atmosphere').value = 'intimate';
    document.getElementById('transportation').value = 'drive';
    document.getElementById('duration').value = '2-3';
    document.getElementById('dressCode').value = 'casual';
    
    document.querySelectorAll('.preference-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.getElementById('dateNightResults').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', init);
