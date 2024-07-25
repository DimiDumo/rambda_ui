import { handle as authHandle } from './auth';

export const handle = async ({ event, resolve }) => {
	console.log('getting hook request', event);
	// Handle CORS preflight requests
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Allow-Credentials': 'true'
			}
		});
	}

	// Apply the authentication handle
	const response = await authHandle({ event, resolve });

	// Add CORS headers to all responses
	response.headers.set('Access-Control-Allow-Origin', '*');

	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	response.headers.set('Access-Control-Allow-Credentials', 'true');

	return response;
};
