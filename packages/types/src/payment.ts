import { z } from "zod";

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Name is required"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d+$/, "Must be only digits"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  cvv: z.string().min(3, "CVV is required").max(4),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;
