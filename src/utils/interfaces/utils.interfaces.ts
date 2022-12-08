import { Response } from "express";

export namespace BuildResponse {
  export type SuccessInput = {
    res: Response;
    statusCode?: number;
    message?: string;
    body?: object;
    success?: boolean;
  };

  export type SuccessOutput = {
    res: Response;
    message: string;
    body: object;
    success: boolean;
  };

  export type ErrorInput = {
    res: Response;
    statusCode: number;
    message?: string;
    body?: object;
    success: boolean;
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
