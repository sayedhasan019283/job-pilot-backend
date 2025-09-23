import { z } from 'zod';

// Zod validation schema for 
 const paymentValidationSchema = z.object({
  body : z.object({
    amount: z.number().positive(), // Ensure the amount is a positive number
  transactionId: z.string().min(1), // Ensure the transactionId is a non-empty string
  userId: z.string().min(1), // userId should be a valid ObjectId string
  })
});

export const paymentValidation = {
    paymentValidationSchema
}

