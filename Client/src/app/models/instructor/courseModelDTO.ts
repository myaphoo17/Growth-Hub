import { UploadFiles } from "../student/StudentUploadFiles";
import { CategoriesDTO } from "./categoriesDTO";
import { Employer } from "./employer";
import { uploadFilesDTO } from "./uploadFilesDTO";

export interface CourseModelDTO{
    id:string;
    date:string;
    description:string;
    duration:string;
    title:string;
    uploadFilesDTO: uploadFilesDTO[];
    categoriesDTO: CategoriesDTO;
    employeeDTO:Employer;
    showDetail:boolean;
    hasExam:boolean;
    lastVideoDate?: Date | string;
}