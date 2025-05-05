import { request } from 'http';
import { create } from 'lodash';
import { z } from 'zod';
import { ChurchCreationButton } from '../components/buttons/ChurchCreationButton';

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

export const requestAdminSchema = z.object({
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const createChurchSchema = z.object({
    churchName: z.string().min(1, "Church name is required"),
    denomination: z.string().min(1, "Denomination is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Phone number is required to be in the format XXX-XXX-XXXX"),
    address: z.string().min(1, "Address is required"),
    postalCode: z.string().length(5, "Postal code is required to be 5 digits"),
    city: z.string().min(1, "City is required"),
});

export const deleteChurchSchema = z.object({
    id: z.number().int().nonnegative().refine(val => val > 0, { message: "Church ID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const deleteMinistrySchema = z.object({
    id: z.number().int().nonnegative().refine(val => val > 0, { message: "Ministry ID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const guardSchema = z.object({
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const deleteMediaSchema = z.object({
    id: z.number().int().nonnegative().refine(val => val > 0, { message: "Media ID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const createMinistrySchema = z.object({
    MinistryName: z.string().min(1, "Ministry name is required"),
    Description: z.string().min(1, "Description is required"),
    Church_ID: z.number().int().nonnegative().refine(val => val > 0, { message: "Church ID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const rejectUserSchema = z.object({
    userID: z.number().int().nonnegative().refine(val => val > 0, { message: "UserID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const requestingAdminSchema= z.object({
    churchID: z.number().int().nonnegative().refine(val => val > 0, { message: "Church ID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const createSuperAdminSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    email: z.string().email("Invalid email format"),
    church_id: z.number().int().nonnegative().refine(val => val > 0, { message: "Church ID must be a positive integer" }),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const updateChurchSchema = z.object({
    churchID: z.number().int().nonnegative().refine(val => val > 0, { message: "Church ID must be a positive integer" }),
    churchName: z.string().min(1, "Church name is required"),
    denomination: z.string().min(1, "Denomination is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Phone number is required to be in the format XXX-XXX-XXXX"),
    address: z.string().min(1, "Address is required"),
    postalcode: z.string().length(5, "Postal code is required to be 5 digits"),
    city: z.string().min(1, "City is required"),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const updateMinistrySchema = z.object({
    ministryId: z.number().int().nonnegative().refine(val => val > 0, { message: "Ministry ID must be a positive integer" }),
    ministryName: z.string().min(1, "Ministry name is required"),
    description: z.string().min(1, "Description is required"),
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const userMinistryIDSchema = z.object({
    authid: z.string().nonempty("Auth0ID is required"),
});

export const userChurchSchema = z.object({
    auth0ID: z.string().nonempty("Auth0ID is required"),
});

export const userMinistrySchema = z.object({
    auth0ID: z.string().nonempty("Auth0ID is required"),
});









