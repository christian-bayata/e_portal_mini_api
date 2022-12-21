export interface UserDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dept: string;
  matricNo?: string;
  staffNo?: string;
  isStaff?: boolean;
  isStudent?: boolean;
  phone: string;
}

export type UserDataInput = {
  [props: string]: any;
};
