import { Component } from '@angular/core';

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.component.html',
  styleUrl: './adm-home.component.css'
})
export class AdmHomeComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;}
}
