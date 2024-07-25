<script lang="ts">
	import { createRepoLogsSubscription } from '$lib/state/logs.svelte';
	import { onDestroy } from 'svelte';

	type Props = {
		repoName: string;
	};

	let { repoName } = <Props>$props();
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
	{#each logs.logs as log}
		{printLog(log)}
		<pre data-prefix="1"><code>{log.text}</code></pre>
	{/each}
</div>
