<script lang="ts">
	import { goto } from '$app/navigation';
	import { signOut } from '@auth/sveltekit/client';
	import { nanoid } from 'nanoid';

	let { data } = $props();

	console.log('data: ', data);

	console.log('Logged in as: ', data.session.user.name);

	async function createNewExEx() {
		try {
			const response = await fetch('/api/exex', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					// Let user choose name, double check if repe exists or add
					// name to beginning of repo name
					name: nanoid(10)
				})
			});

			const { repoName } = await response.json();

			console.log('repoName : ', repoName);

			goto(`/exex/${repoName}`);
		} catch (err) {
			console.error('Err calling POST on /api/exex: ', err);
			throw err;
		}
	}
</script>

<div class="flex justify-center items-center flex-col gap-6">
	<h1 class="text-2xl">ExEx'es</h1>

	<button onclick={createNewExEx} class="btn btn-primary">Create new ExEx</button>

	<button class="btn btn-primary" onclick={signOut}>Logout</button>

	{#await data.githubRepos then githubRepos}
		{#each githubRepos as githubRepo}
			<a href={`/exex/${githubRepo.repo_name}`} class="underline link">{githubRepo.repo_name}</a>
		{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
