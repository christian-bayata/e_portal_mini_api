export interface CourseDto {
  registered_students: string[];
  _id?: string;
  name: string;
  code: string;
  units: number;
  students: string[];
}

export type CourseDataInput = {
  [props: string]: any;
};
