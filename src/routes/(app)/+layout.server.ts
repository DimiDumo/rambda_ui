// src/routes/protected/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event?.locals?.auth();
	console.log('session: ', session);

	if (!session?.user) throw redirect(303, '/login');
	return { session };
};
