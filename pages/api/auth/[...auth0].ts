import { handleAuth, handleCallback, getSession } from "@auth0/nextjs-auth0";

export default handleAuth(
    // {  
    //     async callback(req, res) 
    //     {
    //         try {
    //             await handleCallback(req, res)

    //             const session = await getSession(req, res)
                
    //             if(!session || !session.user) {
    //                 throw new Error('No user session found')
    //             }

    //             const {user, error, isLoading } = useUser();
    //             const auth_id = user.sub;


    //             const result = await verifyAdmin(auth_id);
    //             if (result != null) {
    //                 session.user.role = result;
    //             }
                
    //             res.redirect('/');
    //         } catch (error) {
    //             res.status(error.status || 500).end(error.message);
    //         }
    //     }
    // }
);