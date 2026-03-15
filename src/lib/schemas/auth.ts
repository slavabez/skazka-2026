import { z } from "zod/v4";

export const loginSchema = z.object({
  phone: z.string().min(10, "Номер телефона должен содержать минимум 10 цифр"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export type LoginInput = z.infer<typeof loginSchema>;
