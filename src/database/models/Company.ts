import Mongoose from "../MongoDB";

const CompanySchema = new Mongoose.Schema(
  {
    administrators: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        required: false,
        select: true
      }
    ],
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
  administrators: Mongoose.Types.ObjectId[];
  name: string;
  area: string;
}

export const Company: Mongoose.Model<ICompany> = Mongoose.model<ICompany>(
  "Company",
  CompanySchema
);
