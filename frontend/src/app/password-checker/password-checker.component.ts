import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PasswordService, PasswordRecord } from '../services/password.service';
import { AuthService, AuthUser } from '../services/auth.service';

@Component({
  selector: 'app-password-checker',
  templateUrl: './password-checker.component.html',
  styleUrls: ['./password-checker.component.css']
})
export class PasswordCheckerComponent implements OnInit {
  mode: string = 'basic'; // Default mode
  private _password: string = '';
  generatedPassword: string = ''; // To store the generated password
  personalDetails = {
    firstName: '',
    lastName: '',
    birthDate: ''
  };
  strength: string = '';
  strengthScore: number = 0;
  strengthClass: string = 'progress-bar bg-warning';
  passwordVisible: boolean = false;
  feedback: string[] = []; // To store feedback messages

  // Database related
  userId: string = 'anonymous'; // Default user ID
  showSaveDialog: boolean = false;
  saveNotes: string = '';
  saveTags: string[] = [];
  tagInput: string = '';
  isSaving: boolean = false;
  saveMessage: string = '';
  showSavedPasswords: boolean = false;
  savedPasswords: PasswordRecord[] = [];
  isLoadingPasswords: boolean = false;
  currentUser: AuthUser | null = null;

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
    if (this._password === '') {
      this.resetProgressBar();
    }
  }

  constructor(
    private passwordService: PasswordService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
      if (user?.username) {
        this.userId = user.username;
      }
    });
  }

  setMode(mode: string): void {
    this.mode = mode;
    this.password = ''; // Clear the input bar
    this.generatedPassword = ''; // Clear the generated password
    this.strengthScore = 0; // Reset the progression bar
    this.strength = ''; // Clear the strength text
    this.feedback = []; // Clear feedback messages
    this.strengthClass = 'progress-bar bg-warning'; // Reset progress bar color
    this.personalDetails = {
      firstName: '',
      lastName: '',
      birthDate: ''
    }; // Clear personal details
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.checkPassword();
    } else if (event.key === 'Tab') {
      const modes = ['basic', 'intermediate', 'advanced'];
      const currentIndex = modes.indexOf(this.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      this.setMode(modes[nextIndex]);
    }
  }

  checkPassword(): void {
    this.feedback = []; // Reset feedback messages

    if (this.mode === 'advanced' && !this.generatedPassword && (!this.personalDetails.firstName || !this.personalDetails.lastName || !this.personalDetails.birthDate)) {
      this.strength = 'Please fill in all personal details to evaluate password strength.';
      this.strengthScore = 0;
      this.strengthClass = 'progress-bar bg-warning';
      return; // Stop the execution if personal details are not filled
    }

    if (this.mode === 'advanced' && this.generatedPassword) {
      // Skip personal details check if password is generated
      this.checkBasicLevel(); // Check password strength
    } else if (this.mode === 'advanced') {
      this.checkAdvancedLevel();
    } else if (this.mode === 'intermediate') {
      this.checkTop10Passwords();
    } else {
      this.checkBasicLevel();
    }

    this.updateStrengthMeter();
  }

  checkBasicLevel(): void {
    const hasUpperCase = /[A-Z]/.test(this.password);
    const hasLowerCase = /[a-z]/.test(this.password);
    const hasNumbers = /\d/.test(this.password);
    const hasSpecialChars = /\W/.test(this.password);
    const length = this.password.length;

    this.feedback = []; // Reset feedback messages

    // Check for specific criteria and add feedback messages
    if (!hasUpperCase) {
      this.feedback.push('Missing uppercase letter');
    }
    if (!hasLowerCase) {
      this.feedback.push('Missing lowercase letter');
    }
    if (!hasNumbers) {
      this.feedback.push('Missing a number');
    }
    if (!hasSpecialChars) {
      this.feedback.push('Missing special character');
    }
    if (length < 8) {
      this.feedback.push('Password is too short');
    }

    // Determine strength score and set feedback based on criteria
    if (length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      this.strength = 'Very Strong';
      this.strengthScore = 90;
      this.strengthClass = 'progress-bar bg-success';
    } else if (length >= 8 && (hasUpperCase || hasLowerCase) && hasNumbers && hasSpecialChars) {
      this.strength = 'Strong';
      this.strengthScore = 70;
      this.strengthClass = 'progress-bar bg-primary';
    } else if (length >= 6 && (hasUpperCase || hasLowerCase) && hasNumbers) {
      this.strength = 'Medium';
      this.strengthScore = 50;
      this.strengthClass = 'progress-bar bg-info';
    } else if (length >= 6) {
      this.strength = 'Weak';
      this.strengthScore = 30;
      this.strengthClass = 'progress-bar bg-warning';
    } else {
      this.strength = 'Very Weak';
      this.strengthScore = 10;
      this.strengthClass = 'progress-bar bg-danger';
    }
  }

  checkTop10Passwords(): void {
    const topPasswords = ['123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', '111111', '123123'];
    if (topPasswords.includes(this.password)) {
      this.feedback.push('Password is too common');
      this.strengthScore = 10; // Very Weak
    } else {
      this.checkBasicLevel();
    }
  }

  checkAdvancedLevel(): void {
    const { firstName, lastName, birthDate } = this.personalDetails;

    const birthYear = birthDate.split('-')[0];
    const birthMonth = birthDate.split('-')[1];
    const birthDay = birthDate.split('-')[2];

    const hasPersonalInfo = [
      firstName.toLowerCase(),
      lastName.toLowerCase(),
      birthYear,
      birthMonth,
      birthDay
    ].some(info => this.password.toLowerCase().includes(info));

    if (hasPersonalInfo) {
      this.feedback.push('Password contains personal information');
      this.strengthScore = 10; // Very Weak
    } else {
      this.checkBasicLevel();
    }
  }

  generatePassword(): void {
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

    // Generate a very strong password
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

    this.generatedPassword = generatedPassword;

    // Use generated password for checking
    this.password = generatedPassword;
    this.checkPassword();
  }

  updateStrengthMeter(): void {
    if (this.strengthScore <= 10) {
      this.strength = 'Very Weak';
      this.strengthClass = 'progress-bar bg-danger';
    } else if (this.strengthScore <= 30) {
      this.strength = 'Weak';
      this.strengthClass = 'progress-bar bg-warning';
    } else if (this.strengthScore <= 50) {
      this.strength = 'Medium';
      this.strengthClass = 'progress-bar bg-info';
    } else if (this.strengthScore <= 70) {
      this.strength = 'Strong';
      this.strengthClass = 'progress-bar bg-primary';
    } else if (this.strengthScore <= 90) {
      this.strength = 'Very Strong';
      this.strengthClass = 'progress-bar bg-success';
    }
  }

  resetProgressBar(): void {
    this.strength = '';
    this.strengthScore = 0;
    this.strengthClass = 'progress-bar bg-warning';
    this.feedback = [];
  }

  copyToClipboard(): void {
    if (this.generatedPassword) {
      navigator.clipboard.writeText(this.generatedPassword).then(() => {
        this.saveMessage = 'Generated password copied to clipboard.';
      }).catch(err => {
        this.saveMessage = 'Unable to copy password. Please copy it manually.';
      });
    }
  }

  // Database Methods
  openSaveDialog(): void {
    if (!this.password) {
      this.saveMessage = 'Please enter or generate a password first';
      return;
    }
    this.showSaveDialog = true;
    this.saveMessage = '';
    this.saveTags = [];
    this.tagInput = '';
  }

  closeSaveDialog(): void {
    this.showSaveDialog = false;
    this.saveMessage = '';
    this.saveTags = [];
    this.tagInput = '';
    this.saveNotes = '';
  }

  addTag(): void {
    if (this.tagInput.trim() && !this.saveTags.includes(this.tagInput.trim())) {
      this.saveTags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }

  removeTag(tag: string): void {
    this.saveTags = this.saveTags.filter(t => t !== tag);
  }

  savePassword(): void {
    this.isSaving = true;
    const passwordData: PasswordRecord = {
      userId: this.userId,
      password: this.password,
      mode: this.mode as 'basic' | 'intermediate' | 'advanced',
      strength: this.strength,
      strengthScore: this.strengthScore,
      isGenerated: !!this.generatedPassword,
      feedback: this.feedback,
      personalDetails: this.personalDetails,
      tags: this.saveTags,
      notes: this.saveNotes
    };

    this.passwordService.savePassword(passwordData).subscribe(
      (response) => {
        this.saveMessage = 'Password saved successfully!';
        this.isSaving = false;
        setTimeout(() => {
          this.closeSaveDialog();
        }, 2000);
        // Reload saved passwords list
        this.loadSavedPasswords();
      },
      (error) => {
        this.saveMessage = 'Unable to save password right now. Please try again.';
        this.isSaving = false;
      }
    );
  }

  loadSavedPasswords(): void {
    this.isLoadingPasswords = true;
    this.passwordService.getUserPasswords(this.userId, 10, 0).subscribe(
      (response) => {
        this.savedPasswords = response.data;
        this.isLoadingPasswords = false;
      },
      (error) => {
        this.saveMessage = 'Unable to load saved passwords right now.';
        this.isLoadingPasswords = false;
      }
    );
  }

  toggleShowSavedPasswords(): void {
    this.showSavedPasswords = !this.showSavedPasswords;
    if (this.showSavedPasswords) {
      this.loadSavedPasswords();
    }
  }

  deletePasswordRecord(id: string): void {
    if (confirm('Are you sure you want to delete this password?')) {
      this.passwordService.deletePassword(id).subscribe(
        (response) => {
          this.loadSavedPasswords();
        },
        (error) => {
          this.saveMessage = 'Unable to delete password right now.';
        }
      );
    }
  }

  setUserIdAndLoad(): void {
    if (this.userId) {
      this.loadSavedPasswords();
    }
  }
}

