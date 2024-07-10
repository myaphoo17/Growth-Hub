import { Component } from '@angular/core';
import { Employer } from '../../models/admin/employer';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  adminData: Employer = {} as Employer;
}
