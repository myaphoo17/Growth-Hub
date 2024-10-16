import { CourseModel } from "./courseModel";

export class CategoriesDTO {
  id: number | null ;
  name: string;
  courses: CourseModel[];

  constructor(id: number, name: string, courses: CourseModel[]) {
    this.id = id ;
    this.name = name;
    this.courses = courses;
  }
}
