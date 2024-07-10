import { CategoriesDTO } from "./CategoriesDTO ";
import { UploadFiles } from "./UploadFiles";
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
}