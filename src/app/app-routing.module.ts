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
import { ExamDetailComponent } from './instructor/exam-detail/exam-detail.component';
import { ChangePasswordComponent } from './security/change-password/change-password.component';

import { StudentViewCourseComponent } from './student/student-view-course/student-view-course.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ChatUserPageComponent } from './chat/chat-user-page/chat-user-page.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { StudentGuard } from './security/guard/StudentGuard';
import { GradeModalComponent } from './instructor/grade-modal/grade-modal.component';
import { GradeDetailComponent } from './instructor/grade-detail/grade-detail.component';
import { StudentExamComponent } from './student/student-exam/student-exam.component';
import { IntAssignmentComponent } from './instructor/int-assignment/int-assignment.component';
import { StudentCardDetailComponent } from './student/student-card-detail/student-card-detail.component';
import { IntGraphComponent } from './instructor/int-graph/int-graph.component';
import { CreateCertificateComponent } from './instructor/create-certificate/create-certificate.component';
import { AllCertificatesComponent } from './instructor/all-certificates/all-certificates.component';



const routes: Routes = [
  // Admin Routes
  { path: "admin", component: AdminComponent, canActivate: [AdminGuard],
    children: [
      { path: 'adm-home', component: AdmHomeComponent, children:[
        { path: 'overview', component: DashboardComponent}, 
        { path: 'inst-accounts', component: InstAccountsComponent},
        { path: 'stu-accounts', component: StuAccountsComponent},
        { path: 'fact-check', component: FactCheckComponent},
        { path: 'report', component: ReportComponent },
        { path: 'employee-data', component: EmployeeUploadComponent },
        { path: 'fact-check/fact-check-detail/:id', component: FactDetailComponent },
        { path: 'graph', component: GraphComponent},
        { path: 'exam-view-admin', component: ExamDetailComponent },
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
      ] 
    },
      { path: 'profile-view/:staffId', component: ProfileViewComponent},
      { path: 'courses', component: CoursesComponent},
      { path: 'mycourses', component: StudentHasCourseComponent},
      { path: 'course-details/:courseId',component:StudentViewCourseComponent },
      { path: 'courseDetails/:id', component: StudentHasCourseDetailsComponent},
      { path: 'privateChat/:staffId',component:ChatUserPageComponent },
      { path: 'student-exam', component: StudentExamComponent},
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'adm-home', pathMatch: 'full' },
    ],
  },

  // Instructor Routes
  {
    path: "instructor", component: InstructorComponent, canActivate: [InstructorGuard],
    children: [
      { path: 'int-home', component: InstructorHomeComponent },
      { path: 'int-home/card_detail/:id', component: CardDetailComponent},
      { path: 'int-home/:categoryName', component: InstructorHomeComponent},
      { path: 'profile/mycourse_detail', component: MycourseDetailComponent},
      { path: 'profile', component: ProfileComponent},
      { path: 'preview', component: PreviewComponent},
      { path: 'questions', component: FormCreatorComponent },
      { path: 'create-certificate', component: CreateCertificateComponent},
      { path: 'all-certificates', component: AllCertificatesComponent},

      { path: 'creation-home', component: CreationHomeComponent, children: [
        { path: 'course-creation', component: CourseCreationComponent},
        { path: 'unapprove-course', component: UnapproveCoursesComponent},
        { path: 'create-certificate', component: CreateCertificateComponent},
        
        { path: '', redirectTo: 'course-creation', pathMatch: 'full' },
      ]},
      { path: 'int-graph', component: IntGraphComponent},
      { path: 'profile-view/:staffId', component: ProfileViewComponent},
      { path: 'mycourses', component: StudentHasCourseComponent},
      { path: 'course-details/:courseId',component:StudentViewCourseComponent },
      { path: 'courseDetails/:id', component: StudentHasCourseDetailsComponent},
      { path: 'privateChat/:staffId',component:ChatUserPageComponent },
      { path: 'profile/updatecourse/:id', component: UpdateDetailCourseComponent},
      { path: 'exam-detail', component: ExamDetailComponent },
      { path: 'grade', component: GradeModalComponent },
      { path: 'grade-detail', component: GradeDetailComponent },
      { path: 'int-assignment', component: IntAssignmentComponent},
      { path: '', redirectTo: 'int-home', pathMatch: 'full' },
      { path: 'student-exam', component: StudentExamComponent},
    ],
  },

  // Student Routes
  {
    path: "student", component: StudentComponent, canActivate: [StudentGuard],
    children: [
      { path: 'profile-view/:staffId', component: ProfileViewComponent},
      { path: 'stu-home', component: StudentHomeComponent},
      { path: 'stu-home/card_detail/:id', component: StudentCardDetailComponent},
      { path: 'stu-home/:categoryId', component: StudentHomeComponent},
      { path: 'privateChat/:staffId',component:ChatUserPageComponent },
      { path: 'course-details/:courseId',component:StudentViewCourseComponent },
      { path: 'settings', component: StudentSettingsComponent},
      { path: 'stu-profile', component: StudentProfileComponent },
      { path: 'help-center', component: StudentHelpCenterComponent},
      { path: 'mycourses', component: StudentHasCourseComponent},
      { path: 'student-exam', component: StudentExamComponent},
      // { path: 'courseDetails', component: StudentHasCourseDetailsComponent},
      { path: 'courseDetails/:id', component: StudentHasCourseDetailsComponent},
      { path: 'studentMessaging', component: StudentMessagingComponent},
    ],
  },

 
  // Security Routes

  { path: 'forget_pass', component: ForgotPasswordComponent},
  { path: 'login', component: LoginComponent},

  { path: 'forget_pass', component: ForgotPasswordComponent},
  { path: 'change_pass', component: ChangePasswordComponent},
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },


  // Admin Extra Routes
  { path: 'employers', component: EmployersComponent},
  
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
