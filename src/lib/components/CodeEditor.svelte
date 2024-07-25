<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

	type Props = {
		content: string;
	};

	let { content = $bindable() } = <Props>$props();

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	onMount(async () => {
		console.log('mounting monaco');
		// Import our 'monaco.ts' file here
		// (onMount() will only be executed in the browser, which is what we want)
		monaco = (await import('../monaco')).default;
		console.log('monaco: ', monaco);

		// Your monaco instance is ready, let's display some code!
		editor = monaco.editor.create(editorContainer);
		const model = monaco.editor.createModel(content, 'javascript');
		editor.setModel(model);

		editor.onDidChangeModelContent(() => {
			content = editor.getValue();
		});
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<div class="shadow-xl">
	<div class="container" style="width: 800px; height: 300px" bind:this={editorContainer} />
</div>

<style>
</style>
