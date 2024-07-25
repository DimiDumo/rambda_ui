import { io } from 'socket.io-client';

export function createRepoLogsSubscription(repoName: string) {
	console.log('initializing socket for: ', repoName);
	let logs = $state([]);

	const socket = io('http://localhost:3000');
	socket.emit('subscribe', repoName);

	socket.on('repoUpdate', (log) => {
		console.log(`Received update for ${repoName}:`, log);
		console.log('logs direct: ', log.logs);
		logs.push(...log.logs);
	});

	// Later, to unsubscribe:

	// The socket will automatically unsubscribe on disconnect

	return {
		get logs() {
			return logs;
		},
		unsubscribe() {
			socket.emit('unsubscribe', repoName);
		}
	};
}