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

export const demoteAndAssignSchema = z.object({
    minID: z.number().int().nonnegative().refine(val => val > 0, { message: "MinID must be a positive integer" }),
    userID: z.number().int().nonnegative().refine(val => val > 0, { message: "UserID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const superAdminSchema = z.object({
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const insertUserSchema = z.object({
    nickname: z.string().nonempty("Nickname is required"),
    auth0_id: z.string().nonempty("Auth0ID is required"),
    email: z.string().email("Invalid email format"),
});

export const promoteAdminSchema = z.object({
    userID: z.number().int().nonnegative().refine(val => val > 0, { message: "UserID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});


