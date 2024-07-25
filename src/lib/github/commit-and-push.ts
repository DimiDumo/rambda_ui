import { env } from '$env/dynamic/private';
import { Octokit } from '@octokit/rest';

const { GITHUB_ACCESS_TOKEN } = env;

export async function commitAndPushFileNoForce(
	fileName: string,
	fileContent: string,
	branchName: string,
	repoName: string
) {
	// TODO: remove hardcoded owner when you have a dynamic way to get it
	const owner = 'dimidumo';
	const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${fileName}`;

	// First, get the current file (if it exists) to retrieve its SHA
	let currentFileSha: string | null = null;
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
				'X-GitHub-Api-Version': '2022-11-28'
			}
		});
		if (response.ok) {
			const data = await response.json();
			currentFileSha = data.sha;
		}
	} catch (error) {
		console.log('File does not exist yet');
		throw error;
	}

	// Prepare the request body
	const body = JSON.stringify({
		message: `Update ${fileName}`,
		content: btoa(fileContent), // Base64 encode the content
		branch: branchName,
		sha: currentFileSha // Include SHA if updating an existing file
	});

	// Make the PUT request to create/update the file
	const response = await fetch(url, {
		method: 'PUT',
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
		console.error('Error data:', errorData);
		throw new Error(`Error committing file: ${errorData.message}`);
	}

	const result = await response.json();
	console.log('File committed successfully:', result);
	return result;
}

export async function commitAndPushFile(
	fileName: string,
	fileContent: string,
	branchName: string,
	repoName: string
) {
	const owner = 'dimidumo';
	const octokit = new Octokit({ auth: GITHUB_ACCESS_TOKEN });

	try {
		// Get the current commit SHA for the branch
		const { data: refData } = await octokit.git.getRef({
			owner,
			repo: repoName,
			ref: `heads/${branchName}`
		});
		const currentCommitSha = refData.object.sha;

		// Get the current tree
		const { data: commitData } = await octokit.git.getCommit({
			owner,
			repo: repoName,
			commit_sha: currentCommitSha
		});
		const currentTreeSha = commitData.tree.sha;

		// Create a new blob with the file content
		const { data: blobData } = await octokit.git.createBlob({
			owner,
			repo: repoName,
			content: Buffer.from(fileContent).toString('base64'),
			encoding: 'base64'
		});

		// Create a new tree
		const { data: newTree } = await octokit.git.createTree({
			owner,
			repo: repoName,
			base_tree: currentTreeSha,
			tree: [
				{
					path: fileName,
					mode: '100644',
					type: 'blob',
					sha: blobData.sha
				}
			]
		});

		// Create a new commit
		const { data: newCommit } = await octokit.git.createCommit({
			owner,
			repo: repoName,
			message: `Update ${fileName}`,
			tree: newTree.sha,
			parents: [currentCommitSha]
		});

		// Update the reference
		await octokit.git.updateRef({
			owner,
			repo: repoName,
			ref: `heads/${branchName}`,
			sha: newCommit.sha,
			force: true // This is the "force push" equivalent
		});

		console.log('File committed and pushed successfully');
		return newCommit;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
