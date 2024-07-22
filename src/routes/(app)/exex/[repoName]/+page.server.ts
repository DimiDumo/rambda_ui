import type { PageServerLoad } from './$types';
import db from '$lib/db';
import { checkAuth } from '$lib/check-auth';
import { error } from '@sveltejs/kit';

async function getGithubRepo(repoName: string, githubUserId: number) {
	const {
		rows: [githubRepo]
	} = await db.query`
  	select * from github_repos
    where github_id = ${githubUserId}
	  and repo_name = ${repoName}`;

	if (!githubRepo) {
		error(404, `Github repo not found for user ${githubUserId}`);
	}

	githubRepo.repoUrl = `https://github.com/DimiDumo/${githubRepo.repo_name}`;

	return githubRepo;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	console.log('Calling /exex server function');

	const session = await checkAuth(locals);
	const githubUserId = session.user.githubId;

	return {
		githubRepo: await getGithubRepo(params.repoName, githubUserId)
	};
};
