<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';

	async function onLogin() {
		const result = await signIn('github');
		console.log('result: ', result);
	}
</script>

<h1>Login</h1>
<button class="btn btn-primary" onclick={onLogin}>Login with GitHub</button>
