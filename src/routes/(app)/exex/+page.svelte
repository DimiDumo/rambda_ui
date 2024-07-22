<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import { nanoid } from 'nanoid';

	let { data } = <{ data: PageData }>$props();

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

			const { data } = await response.json();

			console.log('data: ', data);
		} catch (err) {
			console.error('Err calling POST on /api/exex: ', err);
			throw err;
		}
	}
</script>

<div class="flex justify-center items-center flex-col gap-6">
	<h1 class="text-2xl">ExEx'es</h1>

	<button onclick={createNewExEx} class="btn btn-primary">Crete new ExEx</button>

	<button class="btn btn-primary" onclick={signOut}>Logout</button>
</div>
