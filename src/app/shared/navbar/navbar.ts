import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent  {

  // Composant de navigation principal visible sur toutes les pages
  // Fournit des liens vers Home, Employee List et Create Employee
  constructor() {}

}

