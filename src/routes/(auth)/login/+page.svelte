<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<h1>Login</h1>
<button class="btn btn-primary" on:click={() => signIn('github')}>Login with GitHub</button>
