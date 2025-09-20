import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'app-theme';
  darkThemeClass = 'light';

  constructor() {
    // Load saved theme on service initialization
    const savedTheme = localStorage.getItem(this.themeKey);
    if (savedTheme) {
      this.darkThemeClass = savedTheme;
      document.body.classList.add(savedTheme);
    } else {
      document.body.classList.add(this.darkThemeClass);
    }
  }

  enableDarkTheme(): void {
    document.body.classList.remove(this.darkThemeClass);
    this.darkThemeClass = 'dark-theme';
    document.body.classList.add(this.darkThemeClass);
    localStorage.setItem(this.themeKey, this.darkThemeClass);
  }

  disableDarkTheme(): void {
    document.body.classList.remove(this.darkThemeClass);
    this.darkThemeClass = 'light';
    document.body.classList.add(this.darkThemeClass);
    localStorage.setItem(this.themeKey, this.darkThemeClass);
  }

  toggleDarkTheme(): void {
    if (this.darkThemeClass === 'light') {
      this.enableDarkTheme();
    } else {
      this.disableDarkTheme();
    }
  }

  getTheme(): string {
    return this.darkThemeClass;
  }
}
