import Mongoose from "../MongoDB";

const CompanySchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      select: true
    },
    area: {
      type: String,
      required: true,
      select: true
    },
    num_employees: {
      type: Number,
      required: false,
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
  num_employees: number;
}

export const Company: Mongoose.Model<ICompany> = Mongoose.model<ICompany>(
  "Register",
  CompanySchema
);
