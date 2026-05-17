import { Document, Types } from "mongoose";

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type LeadSource = "website" | "instagram" | "referral";

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  remarks?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
