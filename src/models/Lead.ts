import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  nombre: string;
  email: string;
  deporte?: string;
  fuente: string;
  createdAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    deporte: { type: String, trim: true },
    fuente: { type: String, default: "lead-magnet" },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
