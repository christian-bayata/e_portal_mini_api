import { Response } from "express";

export interface AdditionalResponse extends Response {
  data?: any;
}
export namespace BuildResponse {
  export type DataObject = {
    [props: string]: any;
  };

  // export type SuccessInput = {
  //   res: Response;
  //   statusCode?: number;
  //   message?: string;
  //   body?: object;
  //   success?: boolean;
  // };

  export interface SuccessObj {
    success: boolean;
    message: string;
    body: DataObject;
  }

  export interface SuccessErrorInput {
    res: Response;
    statusCode?: number;
    message?: string;
    body?: object;
    success?: boolean;
  }

  export interface FatalErrorInput extends SuccessErrorInput {
    error?: any;
    stack?: any;
  }
}
