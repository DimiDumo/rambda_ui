<script lang="ts">
	import { createRepoLogsSubscription } from '$lib/state/logs.svelte';
	import { onDestroy } from 'svelte';

	type Props = {
		repoName: string;
		showAltLogs: boolean;
	};

	let { repoName, showAltLogs } = <Props>$props();
	let logs = createRepoLogsSubscription(repoName);

	$effect(() => {
		console.log('got new logs in component: ', logs.logs);
	});

	onDestroy(() => {
		logs.unsubscribe();
	});

	function printLog(log) {
		console.log('log: ', log);
	}
</script>

<div class="mockup-code">
	{#if showAltLogs && logs.logs.length === 0}
		<pre data-prefix="1"><code>Building and waiting for logs, might take up to 30 seconds...</code
			></pre>
	{/if}
	{#each logs.logs as log, index}
		{printLog(log)}
		<pre data-prefix={index}><code>{log.text}</code></pre>
	{/each}
</div>

