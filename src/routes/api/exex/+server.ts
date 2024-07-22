import { checkAuth } from '$lib/check-auth';
import createRepoAndAddCollaborator from '$lib/github/new-exex-repo';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

const BASE_REPO_NAME = 'rambda-exex-js-';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const session = await checkAuth(locals);

	console.log('Handling new exex');

	let data;
	try {
		data = await request.json();
	} catch (err) {
		console.error('Could not parse json body', err);
		error(500, 'Could not parse json body');
	}

	console.log('data: ', data);

	const { name } = data;
	console.log('name : ', name);

	const repoName = BASE_REPO_NAME + name;
	const userGithubUsername = session.user!.name!;

	try {
		await createRepoAndAddCollaborator(repoName, userGithubUsername);
	} catch (err) {
		console.error('error creating new ExEx repo: ', err);
	}

	console.log('data: ', data);

	return new Response(String('Ok'));
};
