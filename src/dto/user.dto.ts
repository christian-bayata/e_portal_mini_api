export interface UserDto {
  [prop: string]: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dept: string;
  matricNo: string;
  staffNo: string;
  isStaff: boolean;
  isStudent: boolean;
  phone: string;
  courses: string[];
  resetPasswordToken: string | undefined;
  resetPasswordDate: Date | undefined;
  comparePassword(password: string): boolean | undefined;
  generateJsonWebToken(flag: string): string;
}

export type UserDataInput = {
  [props: string]: any;
};
