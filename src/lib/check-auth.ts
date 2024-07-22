import { redirect } from '@sveltejs/kit';

export async function checkAuth(locals: App.Locals) {
	console.log('checking auth');
	const session = await locals?.auth();
	console.log('session: ', session);

	if (!session?.user) {
		throw redirect(303, '/login');
	}
	return session;
}
