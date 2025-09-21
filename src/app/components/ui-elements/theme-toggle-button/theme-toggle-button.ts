import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle-button.html',
  styleUrl: './theme-toggle-button.scss'
})
export class ThemeToggler {
  private theme = inject(ThemeService);

  isLightTheme(){
    return this.theme.getTheme()=== 'light'?  true: false;
  }
  
  toggleTheme() {
    this.theme.toggleDarkTheme();
  }
}
