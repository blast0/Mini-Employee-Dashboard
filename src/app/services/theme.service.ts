import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'app-theme';   // Key for localStorage
  darkThemeClass = 'light';         // Current theme class (default: light)

  constructor() {
    // Load saved theme on app start
    const savedTheme = localStorage.getItem(this.themeKey);
    if (savedTheme) {
      this.darkThemeClass = savedTheme;
      document.body.classList.add(savedTheme);
    } else {
      // If no theme saved, apply default (light)
      document.body.classList.add(this.darkThemeClass);
    }
  }

  /** Enable dark theme */
  enableDarkTheme(): void {
    document.body.classList.remove(this.darkThemeClass);
    this.darkThemeClass = 'dark-theme';
    document.body.classList.add(this.darkThemeClass);
    localStorage.setItem(this.themeKey, this.darkThemeClass);
  }

  /** Enable light theme */
  disableDarkTheme(): void {
    document.body.classList.remove(this.darkThemeClass);
    this.darkThemeClass = 'light';
    document.body.classList.add(this.darkThemeClass);
    localStorage.setItem(this.themeKey, this.darkThemeClass);
  }

  /** Toggle between light and dark themes */
  toggleDarkTheme(): void {
    if (this.darkThemeClass === 'light') {
      this.enableDarkTheme();
    } else {
      this.disableDarkTheme();
    }
  }

  /** Return current theme */
  getTheme(): string {
    return this.darkThemeClass;
  }
}
