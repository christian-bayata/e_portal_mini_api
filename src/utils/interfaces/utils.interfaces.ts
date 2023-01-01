import { Response } from "express";

export interface AdditionalResponse extends Response {
  data?: any;
  user?: any;
  admin?: any;
}

export interface UserJwtPayload {
  _id: string;
  matricNo?: string;
  isStudent?: boolean;
}

export interface AdminJwtPayload {
  _id: string;
  staffNo?: string;
  isStaff?: boolean;
}

export interface AdminJwtPayload extends UserJwtPayload {
  staffNo?: string;
  isStaff?: boolean;
}

export namespace BuildResponse {
  export type DataObject = {
    [props: string]: any;
  };

  export type DataObjectArray = [
    {
      [props: string]: any;
    }
  ];
  export interface SuccessObj {
    success: boolean;
    message: string;
    body: DataObject;
  }

  export interface SuccessErrorInput {
    res: Response;
    statusCode?: number;
    message?: string;
    body?: DataObject | DataObjectArray;
    success?: boolean;
  }

  export interface FatalErrorInput extends SuccessErrorInput {
    error?: any;
    stack?: any;
  }
}
