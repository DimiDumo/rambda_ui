<script lang="ts">
	import { page } from '$app/stores';
	let { data } = $props();

	console.log('data: ', data);
</script>

<div class="flex justify-center items-center flex-col gap-6">
	<h1 class="text-2xl font-bold">ExEx Area</h1>
	<div>
		Github Repo: <a class="underline link" href={data.githubRepo.repoUrl} target="_blank"
			>{data.githubRepo.repo_name}</a
		>
	</div>
</div>
