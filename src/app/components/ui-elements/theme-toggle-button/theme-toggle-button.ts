import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle-button.html',
  styleUrls: ['./theme-toggle-button.scss'] 
})
export class ThemeToggler {
  // Use Angular's inject() to get ThemeService instance
  private theme = inject(ThemeService);

  /** 
   * Check if the current theme is light.
   * This can be used in template to show the correct icon or label.
   */
  isLightTheme() {
    return this.theme.getTheme() === 'light' ? true : false;
  }

  /**
   * Toggle between light and dark theme.
   * Calls the service method to switch themes.
   */
  toggleTheme() {
    this.theme.toggleDarkTheme();
  }
}
