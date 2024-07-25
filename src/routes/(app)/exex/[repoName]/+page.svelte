<script lang="ts">
	import { page } from '$app/stores';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import Logs from '$lib/components/Logs.svelte';
	let { data } = $props();

	let content = $state(data.files[0]);
	let contentChanged = $state(false);

	$effect(() => {
		contentChanged = true;
	});

	console.log('data: ', data);

	async function onTest() {
		console.log('onTest');
		if (contentChanged) {
			try {
				await save('save');
				await save('testrun');
			} catch (err) {
				console.error('Failed to save', err);
				return;
			}
		}
	}

	async function onDeploy() {
		console.log('onTest');
		try {
			await save('save');
			await save('main');
		} catch (err) {
			console.error('Failed to save', err);
			return;
		}
	}

	async function onSave() {
		await save('save');
	}

	async function save(branchName: string) {
		console.log('onSave');
		contentChanged = false;

		try {
			const response = await fetch(`/api/github/save/${$page.params.repoName}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content,
					branchName
				})
			});

			const responseText = await response.text();

			console.log('response : ', responseText);
		} catch (err) {
			console.error('Err calling POST on : ', err);
		}
	}
</script>

<div class="flex justify-center items-center flex-col gap-6">
	<h1 class="text-2xl font-bold">ExEx Area</h1>
	<div>
		Github Repo: <a class="underline link" href={data.githubRepo.repoUrl} target="_blank"
			>{data.githubRepo.repo_name}</a
		>
	</div>
	<div style="width: 800px; height: 300px">
		<CodeEditor bind:content />
	</div>
	<div class="flex">
		<div class="">
			<button class="btn btn-secondary" onclick={onDeploy}>Deploy</button>
			<button class="btn btn-primary" onclick={onTest}>Run Test</button>
			<button class="btn btn-primary" disabled={!contentChanged} onclick={onSave}>
				{#if contentChanged}
					Save
				{:else}
					Saved
				{/if}
			</button>
		</div>
	</div>
	<div style="width: 800px; height: 300px">
		<Logs repoName={$page.params.repoName} />
	</div>
</div>
