<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
</script>

<div class="flex justify-center items-center flex-col gap-6 mt-12">
	<button class="btn btn-primary" on:click={() => signIn('github')}>Login with GitHub</button>
</div>
