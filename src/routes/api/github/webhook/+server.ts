import type { RequestHandler } from './$types';
import crypto from 'crypto';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
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

	// Handle the webhook event
	const event = JSON.parse(payload);
	console.log('Received GitHub webhook event:', event);

	// TODO: Docker build irgendwie

	return new Response(String('Ok'));
};
