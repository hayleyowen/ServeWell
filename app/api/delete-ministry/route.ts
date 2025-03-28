import { deleteMinistryByURLPath } from '@/app/lib/data';

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return new Response(JSON.stringify({ error: 'Ministry name is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const success = await deleteMinistryByURLPath(name);
        if (success) {
            return new Response(JSON.stringify({ message: 'Ministry deleted successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'Ministry not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error deleting ministry:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}