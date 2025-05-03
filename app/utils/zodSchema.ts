import {z} from 'zod';

// api/admin/route.ts
export const updateAdminSchema = z.object({
    userID: z.string().nonempty("UserID is required"),
    minID: z.string().nonempty("MinID is required"),
    auth0ID: z.string().nonempty("Auth0ID is required"),
})