import type { RequestHandler } from './$types';
import crypto from 'crypto';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { build } from '$lib/docker/build';
import { postToQueue } from '$lib/rabbitmq';
const { API_KEY } = env;

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('x-hub-signature-256');

	if (!signature) {
		error(400, 'No signature found');
	}

	const payload = await request.text();
	const hash = `sha256=${crypto.createHmac('sha256', API_KEY).update(payload).digest('hex')}`;

	if (signature !== hash) {
		error(400, 'Invalid signature');
	}

	let event;
	try {
		// Handle the webhook event
		event = JSON.parse(payload);
	} catch (err) {
		console.error('Error parsing github webhook event: ', err);
		error(500, 'Error parsing github webhook event');
	}

	console.log('Received GitHub webhook event');
	// TODO: also has .full_name including the owner, use that instead in future?
	const branch = event.ref.split('/').pop();
	console.log('branch: ', branch);

	if (!['main', 'testrun'].includes(branch)) {
		console.log(`Unknown branch to build from, ${branch}... skipping`);
		return new Response(String('Skipping build'));
	}

	const repoName = event.repository.name;

	console.log('repoName : ', repoName);

	// TODO: If these are very close, do not build, we just created the repor
	const pushed_at = event.repository.pushed_at;
	const created_at = event.repository.created_at;

	const timeSinceCreated = pushed_at - created_at;
	console.log('timeSinceCreated : ', timeSinceCreated);

	if (timeSinceCreated < 5) {
		return new Response(String('Skipping build, just initialized repo'));
	}

	// try {
	// 	await build(repoName, branch);
	// } catch (err) {
	// 	console.error('error building docker file: ', err);
	// 	error(500, `Failed building Dockerfile for repo ${repoName}`);
	// }

	await postToQueue(branch, JSON.stringify({ name: repoName }));

	console.log('Built dockerfile on githook');

	return new Response(String('Ok'));
};
