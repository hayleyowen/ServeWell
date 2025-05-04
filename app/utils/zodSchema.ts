import { z } from 'zod';

// api/admin/route.ts
export const updateAdminSchema = z.object({
    userID: z.number().int().nonnegative().refine(val => val > 0, { message: "UserID must be a positive integer" }),
    minID: z.number().int().nonnegative().refine(val => val > 0, { message: "MinID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const newUserSchema = z.object({
    authid: z.string().nonempty("Auth0ID is required"),
});

export const demoteAdminSchema = z.object({
    userID: z.number().int().nonnegative().refine(val => val > 0, { message: "UserID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

