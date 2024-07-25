import { env } from '$env/dynamic/private';

const { GITHUB_ACCESS_TOKEN } = env;

export async function getFileFromRepo(repo: string, path: string, branch: string = 'main') {
	// TODO: remove hardcoded owner
	const owner = 'dimidumo';
	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
	console.log('url: ', url);

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('errorData: ', errorData);
		throw new Error(`Error fetching file: ${errorData.message}`);
	}

	const data = await response.json();

	// The content is Base64 encoded, so we need to decode it
	const content = atob(data.content);
	console.log('File content: ', content);

	return content;
}
