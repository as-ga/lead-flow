import { Schema, model, Types } from "mongoose";
import { ILead } from "@/types/lead";

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },

    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost"],
      default: "new",
    },

    source: {
      type: String,
      enum: ["website", "instagram", "referral"],
      required: true,
    },

    remarks: { type: String, trim: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Lead = model<ILead>("Lead", leadSchema);
