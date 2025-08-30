// Dashboard specific functionality
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.updateUI();
        this.updateBadges();
    }

    updateUI() {
        const userData = window.sharedData.userData;
        
        // Update user stats
        document.getElementById('userLevel').textContent = userData.level;
        document.getElementById('userXP').textContent = userData.xp;
        
        const accuracy = userData.totalGames > 0 ? Math.round((userData.correctAnswers / userData.totalGames) * 100) : 0;
        document.getElementById('accuracy').textContent = accuracy + '%';
        document.getElementById('streak').textContent = userData.streak;

        // Update progress bars
        const phishingProgress = document.getElementById('phishingProgress');
        const phishingScore = document.getElementById('phishingScore');
        const passwordProgress = document.getElementById('passwordProgress');
        const passwordScore = document.getElementById('passwordScore');
        const networkProgress = document.getElementById('networkProgress');
        const networkScore = document.getElementById('networkScore');

        if (phishingProgress) phishingProgress.style.width = (userData.phishingScore / 10) * 100 + '%';
        if (phishingScore) phishingScore.textContent = `${userData.phishingScore}/10`;
        if (passwordProgress) passwordProgress.style.width = (userData.passwordScore / 5) * 100 + '%';
        if (passwordScore) passwordScore.textContent = `${userData.passwordScore}/5`;
        if (networkProgress) networkProgress.style.width = (userData.networkScore / 20) * 100 + '%';
        if (networkScore) networkScore.textContent = `${userData.networkScore}/20`;

        // Update stats
        document.getElementById('totalGames').textContent = userData.totalGames;
        document.getElementById('correctAnswers').textContent = userData.correctAnswers;
        document.getElementById('improvementRate').textContent = '85%'; // Mock improvement rate
    }

    updateBadges() {
        const badgesGrid = document.getElementById('badgesGrid');
        if (!badgesGrid) return;

        badgesGrid.innerHTML = '';
        window.sharedData.badges.forEach(badge => {
            const isUnlocked = badge.requirement();
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge-item ${isUnlocked ? '' : 'locked'}`;
            badgeElement.innerHTML = `
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.description}</div>
            `;
            badgesGrid.appendChild(badgeElement);
        });
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
