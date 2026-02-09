export interface PasswordStrengthResult {
  strength: string;
  strengthScore: number;
  strengthClass: string;
  feedback: string[];
}

export class PasswordStrengthUtil {
  static checkPasswordStrength(password: string): PasswordStrengthResult {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /\W/.test(password);
    const length = password.length;

    const feedback: string[] = [];

    if (!hasUpperCase) {
      feedback.push('Missing uppercase letter');
    }
    if (!hasLowerCase) {
      feedback.push('Missing lowercase letter');
    }
    if (!hasNumbers) {
      feedback.push('Missing a number');
    }
    if (!hasSpecialChars) {
      feedback.push('Missing special character');
    }
    if (length < 8) {
      feedback.push('Password is too short');
    }

    let strength = '';
    let strengthScore = 0;
    let strengthClass = 'progress-bar bg-warning';

    if (length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      strength = 'Very Strong';
      strengthScore = 90;
      strengthClass = 'progress-bar bg-success';
    } else if (length >= 8 && (hasUpperCase || hasLowerCase) && hasNumbers && hasSpecialChars) {
      strength = 'Strong';
      strengthScore = 70;
      strengthClass = 'progress-bar bg-primary';
    } else if (length >= 6 && (hasUpperCase || hasLowerCase) && hasNumbers) {
      strength = 'Medium';
      strengthScore = 50;
      strengthClass = 'progress-bar bg-info';
    } else if (length >= 6) {
      strength = 'Weak';
      strengthScore = 30;
      strengthClass = 'progress-bar bg-warning';
    } else {
      strength = 'Very Weak';
      strengthScore = 10;
      strengthClass = 'progress-bar bg-danger';
    }

    return { strength, strengthScore, strengthClass, feedback };
  }

  static generateSecurePassword(): string {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allChars = upperChars + lowerChars + numbers + specialChars;

    let generatedPassword = '';
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumbers = false;
    let hasSpecialChars = false;

    while (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars && generatedPassword.length >= 12)) {
      generatedPassword = '';
      hasUpperCase = false;
      hasLowerCase = false;
      hasNumbers = false;
      hasSpecialChars = false;

      for (let i = 0; i < 12; i++) {
        const randomChar = allChars.charAt(Math.floor(Math.random() * allChars.length));
        generatedPassword += randomChar;

        if (upperChars.includes(randomChar)) {
          hasUpperCase = true;
        }
        if (lowerChars.includes(randomChar)) {
          hasLowerCase = true;
        }
        if (numbers.includes(randomChar)) {
          hasNumbers = true;
        }
        if (specialChars.includes(randomChar)) {
          hasSpecialChars = true;
        }
      }
    }

    return generatedPassword;
  }
}
