import  {  Document, Types } from 'mongoose';


// Define TypeScript interface for the Notification model
export type TNotification = Document & {
  text: string;
  userId: Types.ObjectId; // Referring to the User model
}


