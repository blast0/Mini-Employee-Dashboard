import { Component } from '@angular/core';
import { ThemeToggler } from '../theme-toggle-button/theme-toggle-button';

@Component({
  selector: 'app-navbar',
  imports: [ThemeToggler],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

}
