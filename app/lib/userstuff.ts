export default async function userStuff(authid: string) {
    try {
        const result = await fetch('http://localhost:3000/api/guard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({authid}),
        });

        const data = await result.json();
        console.log("Role: ", data);
        return data;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return { error: 'Failed to fetch user role' };
    }
}