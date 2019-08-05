import { IFormattedYupError, format_yup_error } from "./FormatYupError";

export const validate = async (
  obj: any,
  schema: any
): Promise<Array<IFormattedYupError>> => {
  try {
    await schema.validate(obj, { abortEarly: false });
    return [];
  } catch (ex) {
    return format_yup_error(ex);
  }
};
