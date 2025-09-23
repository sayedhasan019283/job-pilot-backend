import { Document, Schema, model } from 'mongoose';
import { TPrivacyPolicy } from './privacy&Policy.interface';
// Create the PrivacyPolicy Mongoose schema
const privacyPolicySchema = new Schema<TPrivacyPolicy>({
  text: { type: String, required: true }, // This will store the text of the privacy policy
});

// Create the Mongoose model using the schema
export const PrivacyPolicyModel = model<TPrivacyPolicy>('PrivacyPolicy', privacyPolicySchema);