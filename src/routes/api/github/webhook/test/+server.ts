import { postToQueue } from '$lib/rabbitmq';
import type { RequestHandler } from './$types';
// import { build } from '$lib/docker/build';
// import { run } from '$lib/docker/run';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
	try {
		await postToQueue('testrun', JSON.stringify({ name: 'rambda-exex-js-pQpgbIlNGu' }));

		// const tagName = 'rambda-exex-js-pQpgbIlNGu';
		// const branchName = 'testrun';
		// await build(tagName, branchName);
		// console.log('finished build');
		// const logs = await run(tagName, branchName);
		// console.log('finished run with logs: ', logs);
		return new Response(String('Ok'));
	} catch (err) {
		console.error('error in test webhook: ', err);
		error(500, 'Error in webhook testrun');
	}
};
