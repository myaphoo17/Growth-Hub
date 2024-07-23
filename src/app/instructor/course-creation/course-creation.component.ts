// Import required dependencies
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ObjectModel } from '../../models/instructor/objectModel';
import { ProfileService } from '../../services/instructor/profile.service';
import { LoadingService } from '../../pageloading/loading.service';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { WebSocketService } from '../../chat/service/web-socket.service';
import { CategoriesDTO } from '../../models/instructor/categoriesDTO';
import { CategoryService } from '../../services/instructor/CategoriesService.service';

interface Lecture {
  title: string;
  file: File | null;
}

@Component({
  selector: 'app-course-creation',
  templateUrl: './course-creation.component.html',
  styleUrls: ['./course-creation.component.css']
})
export class CourseCreationComponent implements OnInit {
  currentStep = 1;
  newObject: ObjectModel = {
    category: '',
    courseTitle: '',
    courseDescription: '',
    courseCreatorId: '',
    courseDuration: '',
    sectionTitle: ''
  };
  lectures: Lecture[] = [];
  showSuccessModal = false;
  userId = sessionStorage.getItem('userId');
  categories: CategoriesDTO[] = [];
  filteredCategories: CategoriesDTO[] = [];
  selectedCategory: CategoriesDTO | null = null;
  categoryFilter: string = '';
  newLectureTitle: string = 'Trailer video';
  newLectureFile: File | null = null;
  newCategoryName: string = '';

  constructor(
    private instructorService: ProfileService,
    private loadingService: LoadingService,
    private webSocketService: WebSocketService,
    private employerService: EmployerServiceService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data: CategoriesDTO[]) => {
        this.categories = data;
        this.filteredCategories = this.getUniqueCategories(this.categories);
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  getUniqueCategories(categories: CategoriesDTO[]): CategoriesDTO[] {
    const uniqueCategories = new Map<string, CategoriesDTO>();
    categories.forEach(category => {
      if (!uniqueCategories.has(category.name)) {
        uniqueCategories.set(category.name, category);
      }
    });
    return Array.from(uniqueCategories.values());
  }

  filterCategories() {
    const filter = this.categoryFilter.toLowerCase();
    const uniqueCategories = this.getUniqueCategories(this.categories);
    this.filteredCategories = uniqueCategories.filter(category =>
      category.name.toLowerCase().includes(filter)
    );
  }

  onCategorySelected(category: CategoriesDTO) {
    this.selectedCategory = category;
    this.newObject.category = category.name;
  }
  

  // addNewCategory() {
  //   if (this.newCategoryName.trim()) {
  //     const newCategory: CategoriesDTO = { id: null, name: this.newCategoryName.trim(), courses: [] };
  //     this.categoryService.createCategory(newCategory).subscribe(
  //       (createdCategory: CategoriesDTO) => {
  //         this.categories.push(createdCategory);
  //         this.selectedCategory = createdCategory;
  //         this.newObject.category = createdCategory.name;
  //         this.newCategoryName = ''; // Reset the new category input
  //         this.filterCategories(); // Refresh the category list
  //       },
  //       error => {
  //         console.error('Error creating category', error);
  //       }
  //     );
  //   } else {
  //     console.error('New category name is empty');
  //   }
  // }

  nextStep() {
    this.currentStep++;
  }

  prevStep() {
    this.currentStep--;
  }

  addLecture() {
    this.lectures.push({ title: '', file: null });
  }

  removeLecture(index: number) {
    this.lectures.splice(index, 1);
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      if (index === -1) {
        this.newLectureFile = file;
      } else {
        this.lectures[index].file = file;
      }
    }
  }

  saveCourse() {
    const files: File[] = [];
    const fileNames: string[] = [];
    this.newObject.courseCreatorId = this.userId as string;

    if (this.newLectureFile && this.newLectureTitle) {
      files.push(this.newLectureFile);
      fileNames.push(this.newLectureTitle);
    } else {
      console.error('New lecture title or file is missing');
      return;
    }

    for (const lecture of this.lectures) {
      if (lecture.file && lecture.title) {
        files.push(lecture.file);
        fileNames.push(lecture.title);
      } else {
        console.error('Lecture title or file is missing');
        return;
      }
    }

    if (this.selectedCategory) {
      this.newObject.category = this.selectedCategory.name;
    } else {
      console.error('No category selected');
      return;
    }

    this.loadingService.show();
    this.instructorService.uploadCourse(files, fileNames, this.newObject).subscribe(
      response => {
        this.loadingService.hide();
        this.showSuccessModal = true;
        this.employerService.getEmployerList().subscribe(employers => {
          const adminIds = employers
            .filter(employer => employer.role === 'Admin')
            .map(employer => employer.staffId);
          adminIds.forEach(adminId => {
            this.webSocketService.sendMessageNotif(adminId, 'course created');
          });
        });
      },
      error => {
        this.loadingService.hide();
        console.error('Upload failed:', error);
      }
    );
  }

  redirectToCreationPage() {
    this.showSuccessModal = false;
    this.router.navigate(['/instructor/creation-home']);
  }
}
