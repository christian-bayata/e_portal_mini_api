export type CodeInputData = {
  email?: string;
  code?: string;
};

export interface CreateCodeDto {
  id?: number;
  code: string;
  email: string;
}

export interface ConfirmCodeDto {
  id?: number;
  code: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
