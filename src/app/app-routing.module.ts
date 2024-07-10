import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Admin Components
import { EmployersComponent } from './admin/employers/employers.component';
// import { EmployersListComponent } from './admin/employers-list/employers-list.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { InstAccountsComponent } from './admin/inst-accounts/inst-accounts.component';
import { StuAccountsComponent } from './admin/stu-accounts/stu-accounts.component';
// Instructor Components
import { InstructorHomeComponent } from './instructor/home/home.component';
import { CardDetailComponent } from './instructor/card-detail/card-detail.component';
import { MycourseDetailComponent } from './instructor/mycourse-detail/mycourse-detail.component';
import { CourseCreationComponent } from './instructor/course-creation/course-creation.component';
import { ProfileComponent } from './instructor/profile/profile.component';
import { PreviewComponent } from './instructor/preview/preview.component';
import { FormCreatorComponent } from './instructor/form-creator/form-creator.component';
// Security Components
import { ForgotPasswordComponent } from './security/forgot-password/forgot-password.component';
import { LoginComponent } from './security/login/login.component';
// Layout Components
import { AdminComponent } from './layout/admin/admin.component';
import { InstructorComponent } from './layout/instructor/instructor.component';
import { AdmHomeComponent } from './admin/adm-home/adm-home.component';
import { FactCheckComponent } from './admin/fact-check/fact-check.component';
import { ReportComponent } from './admin/report/report.component';
import { GraphComponent } from './admin/graph/graph.component';
import { MessageComponent } from './admin/message/message.component';
import { AdminGuard } from './security/guard/AdminGuard';
import { InstructorGuard } from './security/guard/InstructorGuard';
import { EmployeeUploadComponent } from './admin/employee-upload/employee-upload.component';
import { UpdateDetailCourseComponent } from './instructor/update-detail-course/update-detail-course.component';
import { FactDetailComponent } from './admin/fact-detail/fact-detail.component';
import { CreationHomeComponent } from './instructor/creation-home/creation-home.component';
import { UnapproveCoursesComponent } from './instructor/unapprove-courses/unapprove-courses.component';

//student
import { StudentHomeComponent } from './student/student-home/student-home.component';
import { StudentComponent } from './layout/student/student.component';
import { StudentHelpCenterComponent } from './student/student-help-center/student-help-center.component';
import { StudentSettingsComponent } from './student/student-settings/student-settings.component';
import { StudentHasCourseComponent } from './student/student-has-course/student-has-course.component';
import { StudentHasCourseDetailsComponent } from './student/student-has-course-details/student-has-course-details.component';
import { StudentMessagingComponent } from './student/student-messaging/student-messaging.component';
import { StudentProfileComponent } from './student/student-profile/student-profile.component';



const routes: Routes = [
  // Admin Routes
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard], data: { breadcrumb: 'Admin' },
    children: [
      { path: 'adm-home', component: AdmHomeComponent, data: { breadcrumb: 'Home' }, children:[
        { path: 'overview', component: DashboardComponent, data: { breadcrumb: 'Overview' } }, 
        { path: 'inst-accounts', component: InstAccountsComponent, data: { breadcrumb: 'Institution Accounts' } },
        { path: 'stu-accounts', component: StuAccountsComponent, data: { breadcrumb: 'Student Accounts' } },
        { path: 'fact-check', component: FactCheckComponent, data: { breadcrumb: 'Fact Check' } },
        { path: 'report', component: ReportComponent, data: { breadcrumb: 'Report' } },
        { path: 'employee-data', component: EmployeeUploadComponent, data: { breadcrumb: 'Employee Data' } },
        { path: 'fact-check/fact-check-detail/:id', component: FactDetailComponent, data: { breadcrumb: 'Fact Detail' } },
        { path: 'graph', component: GraphComponent, data: { breadcrumb: 'Graph' } },
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
      ] 
    },
      { path: 'message', component:  MessageComponent, data: { breadcrumb: 'Message' } },
      { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Profile' } },
      { path: '', redirectTo: 'adm-home', pathMatch: 'full' },
    ],
  },

  // Instructor Routes
  {
    path: "instructor", component: InstructorComponent, canActivate: [InstructorGuard],
    children: [
      { path: 'int-home', component: InstructorHomeComponent, data: { breadcrumb: 'Home' } },
      { path: 'int-home/card_detail', component: CardDetailComponent, data: { breadcrumb: 'Card Detail' } },
      { path: 'profile/mycourse_detail', component: MycourseDetailComponent, data: { breadcrumb: 'My Course Detail' } },
      { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Profile' } },
      { path: 'preview', component: PreviewComponent, data: { breadcrumb: 'Preview' } },
      { path: 'questions', component: FormCreatorComponent, data: { breadcrumb: 'Questions' } },
      { path: 'creation-home', component: CreationHomeComponent, data: { breadcrumb: 'Creation Home' }, children: [
        { path: 'course-creation', component: CourseCreationComponent, data: { breadcrumb: 'Course Creation' } },
        { path: 'unapprove-course', component: UnapproveCoursesComponent, data: { breadcrumb: 'Unapproved Courses' } },
        { path: '', redirectTo: 'course-creation', pathMatch: 'full' },
      ]},
      { path: 'profile/updatecourse/:id', component: UpdateDetailCourseComponent, data: { breadcrumb: 'Update Course' } },
      { path: '', redirectTo: 'int-home', pathMatch: 'full' },
    ],
  },

  // Student Routes
  {
    path: "student", component: StudentComponent, data: { breadcrumb: 'Student' },
    children: [
      { path: 'stu-home', component: StudentHomeComponent, data: { breadcrumb: 'Home' } },
      { path: 'settings', component: StudentSettingsComponent, data: { breadcrumb: 'Settings' } },
      { path: 'mycourses', component: StudentHasCourseComponent, data: { breadcrumb: 'My Courses' } },
      { path: 'stu-profile', component: StudentProfileComponent, data: { breadcrumb: 'Profile' } },
      { path: 'help-center', component: StudentHelpCenterComponent, data: { breadcrumb: 'Help Center' } },
      { path: 'studentCourseDetails', component: StudentHasCourseDetailsComponent, data: { breadcrumb: 'Course Details' } },
      { path: 'courseDetails/:id', component: StudentHasCourseDetailsComponent, data: { breadcrumb: 'Course Details' } },
      { path: 'studentMessaging', component: StudentMessagingComponent, data: { breadcrumb: 'Messaging' } },
    ],
  },

  // Security Routes
  { path: 'forget_pass', component: ForgotPasswordComponent, data: { breadcrumb: 'Forgot Password' } },
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },

  // Admin Extra Routes
  { path: 'employers', component: EmployersComponent, data: { breadcrumb: 'Employers' } },
  
  // Default Route
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Wildcard Route (Optional, can be used for 404 page)
  { path: '**', redirectTo: '/login' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
