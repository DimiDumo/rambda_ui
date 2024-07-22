import type { PageServerLoad } from './$types';
import db from '$lib/db';
import { checkAuth } from '$lib/check-auth';

async function getGithubRepos(githubUserId: number) {
	const { rows } = await db.query`
  	select * from github_repos
    where github_id = ${githubUserId}`;

	rows.forEach((row) => {
		row.repoUrl = `https://github.com/DimiDumo/${row.repo_name}`;
	});

	return rows;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	console.log('Calling /exex server function');

	const session = await checkAuth(locals);
	const githubUserId = session.user.githubId;

	return {
		githubRepos: await getGithubRepos(githubUserId)
	};
};
