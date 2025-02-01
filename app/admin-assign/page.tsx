import '@/app/globals.css';
import { getUnAssignedAdmins } from '@/app/lib/data';

/* 
    When an admin creates their account, they will not be assigned to any
    ministry yet. This page will be seen by the superadmin, who will be in
    charge of assigning the admin to a ministry.

    This page should show a table of all the admins that have been created
    but haven't been assigned to any ministry yet. The superadmin can then
    select an admin and assign them to a ministry.
*/


export default async function AdminAssignPage() {
    // retrieve all the admins that haven't been assigned to any ministry
    const admins = await getUnAssignedAdmins();

    return (
        <section className="h-screen flex flex-col">
        <div className="flex-1 flex flex-col bg-blue-500 p-20">
            <div className="flex flex-col items-center justify-center pt-8">
            <h2 className="text-2xl font-bold text-white mb-8">Admin Assignment Page</h2>
            </div>
            <div className="items-center justify-center">
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                    <div className="bg-white p-4 rounded-lg shadow-md"/>
                </div> */}
                <table className="table-auto flex-initial w-full bg-white rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200">
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Ministry Requested</th>
                            <th>Join Date</th>
                            <th>Assignment Status</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        </section>
    );
    }
