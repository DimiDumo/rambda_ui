// import GitHub from 'github-api';
import { env } from '$env/dynamic/private';

const { GITHUB_ACCESS_TOKEN, JS_TEMPLATE_REPO, GITHUB_WEBHOOK_URL, API_KEY } = env;

// TODO: use org to manage repos

export default async function createRepoAndAddCollaborator(
	repoName: string,
	collaboratorUsername: string
) {
	try {
		const createRepoResponse = await createRepoFromTemplate(repoName);
		console.log('Created new user js ExEx repo');

		// TODO: ENV VAR for owner
		await addCollaborator('dimidumo', repoName, collaboratorUsername);
		console.log('Collaborator invited to js ExEx repo');

		await addWebhookToRepo(repoName);
		console.log('Added webhook to repo');

		return createRepoResponse.data;
	} catch (error) {
		console.error('Error in createRepoAndAddCollaborator: ', error);
		throw error;
	}
}

async function addCollaborator(owner: string, repo: string, username: string) {
	const url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`;

	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		}
		// Only available for organizations
		// body: JSON.stringify({
		// 	permission: 'push'
		// })
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`Error adding collaborator: ${errorData.message}`);
	}

	const data = await response.json();
	return data;
}

async function createRepoFromTemplate(newRepoName: string) {
	const url = `https://api.github.com/repos/${JS_TEMPLATE_REPO}/generate`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: newRepoName,
			description: 'Rambda ExEx javascript verions',
			private: true,
			include_all_branches: true,
			// TODO: use env var for this
			owner: 'dimidumo'
		})
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`Error creating repository from template: ${errorData.message}`);
	}

	const newRepo = await response.json();

	return newRepo;
}

async function addWebhookToRepo(repo: string) {
	// TODO: swap owner dimidumo for dynamic one
	const url = `https://api.github.com/repos/dimidumo/${repo}/hooks`;

	console.log('url: ', url);

	const body = JSON.stringify({
		name: 'web',
		active: true,
		events: ['push'],
		config: {
			url: GITHUB_WEBHOOK_URL,
			content_type: 'json',
			secret: API_KEY
		}
	});

	console.log('body: ', body);

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
			'X-GitHub-Api-Version': '2022-11-28',
			'Content-Type': 'application/json'
		},
		body
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('errorData: ', errorData);
		throw new Error(`Error adding webhook: ${errorData.message}`);
	}

	console.log('Webhook added: ', await response.json());
}
