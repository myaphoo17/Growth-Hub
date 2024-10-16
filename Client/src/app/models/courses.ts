export interface Course {
  id: number;
  title: string;
  isDelete: boolean;
  isApproved: boolean;
  description: string;
  duration: string;
  endDate: string;
  startDate: string;
  categoriesDTO: {
    id: number;
    name: string;
}; 
}
