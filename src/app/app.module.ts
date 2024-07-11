import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Angular Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

// App Components
import { AppComponent } from './app.component';
import { AdmHomeComponent } from './admin/adm-home/adm-home.component';
import { AdmNavBarComponent } from './admin/adm-nav-bar/adm-nav-bar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { EmployersListComponent } from './admin/employer-list/employer-list.component';
import { EmployersComponent } from './admin/employers/employers.component';
import { FactCheckComponent } from './admin/fact-check/fact-check.component';
import { GraphComponent } from './admin/graph/graph.component';
import { InstAccountsComponent } from './admin/inst-accounts/inst-accounts.component';
import { NotificationComponent } from './admin/notification/notification.component';
import { ReportComponent } from './admin/report/report.component';
import { SideBarComponent } from './admin/side-bar/side-bar.component';
import { StuAccountsComponent } from './admin/stu-accounts/stu-accounts.component';
import { CardComponent } from './instructor/card/card.component';
import { CardDetailComponent } from './instructor/card-detail/card-detail.component';
import { CourseCreationComponent } from './instructor/course-creation/course-creation.component';
import { FooterComponent } from './instructor/footer/footer.component';
import { InstructorHomeComponent } from './instructor/home/home.component';
import { MycourseComponent } from './instructor/mycourse/mycourse.component';
import { MycourseDetailComponent } from './instructor/mycourse-detail/mycourse-detail.component';
import { IntstructorNavBarComponent } from './instructor/nav-bar/nav-bar.component';
import { ProfileComponent } from './instructor/profile/profile.component';
import { RatingComponent } from './instructor/rating/rating.component';
import { RecommentCardComponent } from './instructor/recomment-card/recomment-card.component';
import { AdminComponent } from './layout/admin/admin.component';
import { InstructorComponent } from './layout/instructor/instructor.component';
import { StudentComponent } from './layout/student/student.component';
import { SampleChartComponent } from './sample-chart/sample-chart.component';
import { ForgotPasswordComponent } from './security/forgot-password/forgot-password.component';
import { LoginComponent } from './security/login/login.component';
import { NgChartsModule } from 'ng2-charts';
import { FilterDataPipe } from './admin/employer-list/filter-employer-data';
import { MessageComponent } from './admin/message/message.component';
import { EmployeeUploadComponent } from './admin/employee-upload/employee-upload.component';
import { ConfirmationDialogComponent } from './instructor/confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoadingComponent } from './pageloading/loading/loading.component';
import { LoadingService } from './pageloading/loading.service';
import { UpdateDetailCourseComponent } from './instructor/update-detail-course/update-detail-course.component';
import { FactDetailComponent } from './admin/fact-detail/fact-detail.component';
import { IntSideBarComponent } from './instructor/int-side-bar/int-side-bar.component';
import { UnapproveCoursesComponent } from './instructor/unapprove-courses/unapprove-courses.component';
import { CreationHomeComponent } from './instructor/creation-home/creation-home.component';

import { AnswerKeyModalComponent } from './instructor/answer-key-modal/answer-key-modal.component';
import { PreviewComponent } from './instructor/preview/preview.component';
import { FormCreatorComponent } from './instructor/form-creator/form-creator.component';

//student
import { StudentCourseDetailsSideBarComponent } from './student/student-course-details-side-bar/student-course-details-side-bar.component';
import { StudentHasCourseComponent } from './student/student-has-course/student-has-course.component';
import { StudentNavComponent } from './student/student-nav/student-nav.component';
import { StudentHomeComponent } from './student/student-home/student-home.component';
import { StudentMessagingComponent } from './student/student-messaging/student-messaging.component';
import { StudentMsgSidebarComponent } from './student/student-messaging/student-msg-sidebar/student-msg-sidebar.component';
import { StudentSettingsComponent } from './student/student-settings/student-settings.component';
import { StudentProfileComponent } from './student/student-profile/student-profile.component';
import { StudentViewCourseComponent } from './student/student-view-course/student-view-course.component';
import { StudentHasCourseDetailsComponent } from './student/student-has-course-details/student-has-course-details.component';
import { CoursesComponent } from './components/courses/courses.component';
import { BreadcrumbComponent } from 'xng-breadcrumb';
import { RouteReferComponent } from './components/route-refer/route-refer.component';
import { StudentExamComponent } from './student/student-exam/student-exam.component';
import { CourseAttendanceComponent } from './course-attendance/course-attendance.component';




// // Services
// import { LoginServiceService } from './security/services/login-service.service';
// import { ProfileService } from './instructor/services/profile.service';
// import { EmployerService } from './instructor/services/employer.service';
// import { CourseService } from './instructor/services/course-post.service';

@NgModule({
  declarations: [
    AppComponent,
    //admin
    AdmHomeComponent,
    AdmNavBarComponent,
    DashboardComponent,
    EmployersListComponent,
    EmployeeUploadComponent,
    EmployersComponent,
    FactCheckComponent,
    GraphComponent,
    InstAccountsComponent,
    NotificationComponent,
    ReportComponent,
    SideBarComponent,
    StuAccountsComponent,
    //instructor
    CardComponent,
    CardDetailComponent,
    CourseCreationComponent,
    FooterComponent,
    InstructorHomeComponent,
    MycourseComponent,
    MycourseDetailComponent,
    IntstructorNavBarComponent,
    ProfileComponent,
    RatingComponent,
    RecommentCardComponent,
    AnswerKeyModalComponent,
    PreviewComponent,
    FormCreatorComponent,
    //layout
    AdminComponent,
    InstructorComponent,
    StudentComponent,
    SampleChartComponent,
    //Security
    ForgotPasswordComponent,
    LoginComponent,
    //Student 
    StudentComponent,
    StudentCourseDetailsSideBarComponent,
    StudentNavComponent,
    StudentHomeComponent,
    StudentMessagingComponent,
    StudentMsgSidebarComponent,
    StudentSettingsComponent,
    StudentProfileComponent,
    StudentViewCourseComponent,
    StudentHasCourseDetailsComponent,
    CoursesComponent,
    StudentHasCourseComponent,
    
    //other
    FilterDataPipe,
    MessageComponent,
    ConfirmationDialogComponent,
    LoadingComponent,
    UpdateDetailCourseComponent,
    FactDetailComponent,
    IntSideBarComponent,
    UnapproveCoursesComponent,
    CreationHomeComponent,
    RouteReferComponent,
    StudentExamComponent,
    CourseAttendanceComponent,
  ],
  imports: [
    
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    ReactiveFormsModule,
    
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatListModule,
    NgChartsModule,
    MatDialogModule,
    BreadcrumbComponent

  ],
  providers: [
    provideClientHydration(),
    LoadingService,
    provideHttpClient(withInterceptorsFromDi()),
 
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
