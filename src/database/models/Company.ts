import Mongoose from "../MongoDB";

const CompanySchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      select: true,
      unique: true
    },
    area: {
      type: String,
      required: true,
      select: true
    }
  },
  {
    timestamps: true
  }
);

export interface ICompany extends Mongoose.Document {
  name: string;
  area: string;
}

export const Company: Mongoose.Model<ICompany> = Mongoose.model<ICompany>(
  "Register",
  CompanySchema
);
