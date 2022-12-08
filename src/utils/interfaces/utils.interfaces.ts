import { Response } from "express";

export namespace BuildResponse {
  export type DataObject = {
    [props: string]: any;
  };

  export type SuccessInput = {
    res: Response;
    statusCode?: number;
    message?: string;
    body?: object;
    success?: boolean;
  };

  export type SuccessObj = {
    success: boolean;
    message: string;
    body: DataObject;
  };

  export type ErrorInput = {
    res: Response;
    statusCode?: number;
    error?: string;
    body?: object;
    success?: boolean;
  };

  export type FatalErrorInput = {
    res: Response;
    statusCode?: number;
    message?: string;
    body?: object;
    success?: boolean;
    error?: any;
    stack?: any;
  };
}
