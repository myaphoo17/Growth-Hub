import { CategoriesDTO } from "./StudentCategoriesDTO ";
import { UploadFiles } from "./StudentUploadFiles";
import { Employer } from "./employer";

export interface StdentCourseModel{
    id:string;
    date:string;
    description:string;
    duration:string;
    title:string;
    uploadFilesDTO: UploadFiles[];
    categoriesDTO: CategoriesDTO;
    employeeDTO:Employer;
    showDetail:boolean;
    examAnswercount:number;
}