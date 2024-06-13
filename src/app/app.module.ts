import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { RecommentCardComponent } from './recomment-card/recomment-card.component';
import { ProfilePhotoModalComponent } from './profile-photo-modal/profile-photo-modal.component';
import { CourseCreationComponent } from './course-creation/course-creation.component';
import { AddEducationModalComponent } from './add-education-modal/add-education-modal.component';
import { CoursepageComponent } from './coursepage/coursepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingComponent } from './rating/rating.component';
import { MycourseComponent } from './mycourse/mycourse.component';
import { MycourseDetailComponent } from './mycourse-detail/mycourse-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    ContactComponent,
    ProfileComponent,
    CardComponent,
    FooterComponent,
    CardDetailComponent,
    RecommentCardComponent,
    ProfilePhotoModalComponent,
    CourseCreationComponent,
    AddEducationModalComponent,
    CoursepageComponent,
    RatingComponent,
    MycourseComponent,
    MycourseDetailComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatFormFieldModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
