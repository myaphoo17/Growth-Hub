import { UploadFiles } from "../student/StudentUploadFiles";
import { CategoriesDTO } from "./categoriesDTO";
import { Employer } from "./employer";

export interface CourseModel{
    id:string;
    date:string;
    description:string;
    duration:string;
    title:string;
    uploadFiles: UploadFiles[];
    categoriesDTO: CategoriesDTO;
    employeeDTO:Employer;
    showDetail:boolean;
    hasExam:boolean;
    lastVideoDate?: Date | string;
}