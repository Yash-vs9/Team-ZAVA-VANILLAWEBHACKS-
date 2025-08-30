// Shared functionality across all pages
class SharedData {
    constructor() {
        this.userData = this.loadUserData();
        this.phishingEmails = [
            {
                id: 1,
                sender: "security@yourbank-verify.com",
                subject: "URGENT: Account Suspension Notice",
                preview: "Your account will be suspended in 24 hours. Click here to verify your information immediately to prevent suspension.",
                is_phishing: true,
                red_flags: ["Suspicious domain", "Urgent language", "Generic greeting"]
            },
            {
                id: 2,
                sender: "noreply@microsoft.com",
                subject: "Your monthly Microsoft 365 statement",
                preview: "Your Microsoft 365 subscription has been renewed for $9.99. Thank you for your continued subscription.",
                is_phishing: false,
                red_flags: []
            },
            {
                id: 3,
                sender: "support@paypal-security.net",
                subject: "Action Required: Unusual Activity Detected",
                preview: "We've detected unusual activity on your account. Please verify your identity within 48 hours to maintain access.",
                is_phishing: true,
                red_flags: ["Fake domain", "Fear tactics", "Immediate action required"]
            },
            {
                id: 4,
                sender: "hr@company.com",
                subject: "Team Meeting Tomorrow",
                preview: "Hi everyone, just a reminder about our team meeting tomorrow at 2 PM in the conference room. Please bring your reports.",
                is_phishing: false,
                red_flags: []
            },
            {
                id: 5,
                sender: "amazon-security@amaz0n-verify.com",
                subject: "Your order has been cancelled",
                preview: "Order #123456 has been cancelled due to payment issues. Click here to update your payment method and reprocess the order.",
                is_phishing: true,
                red_flags: ["Misspelled domain", "Zero instead of O", "Payment scare"]
            }
        ];

        this.passwordRules = [
            {rule: "Minimum 8 characters", points: 1, test: (pwd) => pwd.length >= 8},
            {rule: "Contains uppercase letter", points: 1, test: (pwd) => /[A-Z]/.test(pwd)},
            {rule: "Contains lowercase letter", points: 1, test: (pwd) => /[a-z]/.test(pwd)},
            {rule: "Contains number", points: 1, test: (pwd) => /[0-9]/.test(pwd)},
            {rule: "Contains special character", points: 1, test: (pwd) => /[^A-Za-z0-9]/.test(pwd)},
            {rule: "Minimum 12 characters", points: 2, test: (pwd) => pwd.length >= 12},
            {rule: "No common passwords", points: 2, test: (pwd) => !this.commonPasswords.includes(pwd.toLowerCase())}
        ];

        this.commonPasswords = ["password", "123456", "password123", "admin", "letmein", "welcome", "monkey", "dragon"];

        this.networkThreats = [
            {type: "Malware", description: "Suspicious executable detected", severity: "high"},
            {type: "Unauthorized Access", description: "Unknown device attempting connection", severity: "medium"},
            {type: "Data Exfiltration", description: "Large data transfer to external server", severity: "critical"},
            {type: "Phishing", description: "Suspicious email with malicious links", severity: "medium"}
        ];

        this.badges = [
            {name: "Phishing Pro", description: "Detected 10 phishing emails", icon: "🎯", requirement: () => this.userData.phishingScore >= 10},
            {name: "Password Master", description: "Created 5 strong passwords", icon: "🔐", requirement: () => this.userData.passwordScore >= 5},
            {name: "Network Guardian", description: "Blocked 20 network threats", icon: "🛡️", requirement: () => this.userData.networkScore >= 20},
            {name: "Cyber Rookie", description: "Completed first training module", icon: "🌟", requirement: () => this.userData.totalGames >= 1},
            {name: "Security Streak", description: "7 days consecutive training", icon: "🔥", requirement: () => this.userData.streak >= 7}
        ];

        this.cybersecurityTips = [
            "Never click on suspicious links in emails",
            "Use unique passwords for each account",
            "Enable two-factor authentication when possible",
            "Keep software and systems updated",
            "Be cautious when downloading files from the internet",
            "Verify sender identity before sharing sensitive information"
        ];
    }

    loadUserData() {
        const saved = localStorage.getItem('cyberGuardUserData');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            level: 1,
            xp: 0,
            phishingScore: 0,
            passwordScore: 0,
            networkScore: 0,
            badges: [],
            totalGames: 0,
            correctAnswers: 0,
            streak: 0,
            achievements: []
        };
    }

    saveUserData() {
        localStorage.setItem('cyberGuardUserData', JSON.stringify(this.userData));
    }

    updateUserData(updates) {
        Object.assign(this.userData, updates);
        this.saveUserData();
    }

    checkNewBadges() {
        const newBadges = [];
        this.badges.forEach(badge => {
            if (badge.requirement() && !this.userData.badges.includes(badge.name)) {
                this.userData.badges.push(badge.name);
                newBadges.push(badge);
            }
        });
        this.saveUserData();
        return newBadges;
    }
}

// Global shared data instance
window.sharedData = new SharedData();
