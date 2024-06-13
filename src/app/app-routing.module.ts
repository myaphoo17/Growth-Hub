import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { CourseCreationComponent } from './course-creation/course-creation.component';
import { MycourseDetailComponent } from './mycourse-detail/mycourse-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'card_detail', component: CardDetailComponent },
  { path: 'mycourse_detail', component: MycourseDetailComponent },
  { path: 'course_creation', component: CourseCreationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
