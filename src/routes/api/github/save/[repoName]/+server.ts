import { checkAuth } from '$lib/check-auth';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import db from '$lib/db';
import { commitAndPushFile } from '$lib/github/commit-and-push';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const session = await checkAuth(locals);
	const githubUserId = session.user.githubId;
	const { repoName } = params;
	console.log('repoName: ', repoName);

	const {
		rows: [githubRepo]
	} = await db.query`
	  select * from github_repos
		where github_id = ${githubUserId}
		and repo_name = ${repoName}
	`;

	console.log('githubRepo: ', githubRepo);

	if (!githubRepo) {
		error(403, `User ${githubUserId} does not have any repo ${repoName}`);
	}

	// double check user is allowed to push

	let data;
	try {
		data = await request.json();
	} catch (err) {
		console.error('Could not parse json body', err);
		error(500, 'Could not parse json body');
	}

	try {
		await commitAndPushFile('index.js', data.content, data.branchName, repoName);
	} catch (err) {
		console.error(`Failed to commit and deploy to repo ${repoName}`, err);
		error(500, `Failed to commit and deploy to repo ${repoName}`);
	}
	console.log('data: ', data);

	return new Response(String('Ok'));
};
