import { ValidationError } from "yup";

export interface IFormattedYupError {
  path: string;
  message: string;
}

export const format_yup_error = (
  error: ValidationError
): Array<IFormattedYupError> =>
  error.inner.map<any>((e: any) => ({
    path: e.path,
    message: e.message
  }));
