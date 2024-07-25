import { handle as authHandle } from './auth';

export const handle = async ({ event, resolve }) => {
	// First, apply the authentication handle
	const response = await authHandle({ event, resolve });

	// Then, add CORS headers
	response.headers.append('Access-Control-Allow-Origin', 'https://specific-domain.com');
	response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	response.headers.append('Access-Control-Allow-Credentials', 'true');

	// Handle OPTIONS request
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			headers: response.headers
		});
	}

	return response;
};
