<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '$lib/components/general/Icon.svelte';
	import ChevronRightIcon from '$lib/components/general/icons/ChevronRightIcon.svelte';
	import ChevronDownIcon from '$lib/components/general/icons/ChevronDownIcon.svelte';
	export let directory;
	export let isExpanded = false;
	const toggleList = () => {
		isExpanded = !isExpanded;
	};
</script>

<div class="wrapper">
	<li class="dir">
		<div class="header">
			<p>
				{directory.name}
			</p>

			<button on:click={toggleList}>
				{#if isExpanded}
					<Icon>
						<ChevronDownIcon />
					</Icon>
				{:else}
					<Icon>
						<ChevronRightIcon />
					</Icon>
				{/if}
			</button>
		</div>
		{#if isExpanded}
			<div class="expanded">
				<ul class="file-list" in:slide={{ axis: 'y', duration: 300 }}>
					{#if directory.files.length > 0}
						{#each directory.files as file}
							<li>
								<a href={`/docs/${directory.name}/${file.slug}`}>
									<p>{file.slug}</p>
								</a>
							</li>
						{/each}
					{/if}

					<!--{#if directory.directories && directory.directories.length > 0}-->
					<!--	{#each directory.directories as subDirectory}-->
					<!--		<svelte:self directory={subDirectory} />-->
					<!--	{/each}-->
					<!--{/if}-->
				</ul>
			</div>
		{/if}
	</li>
</div>

<style lang="scss">
	a {
		text-decoration: none;
		color: var(--color-text-3);
	}
	li {
		list-style: none;
	}

	.wrapper {
		display: flex;
		padding: 0 0 0.5rem;
		width: 100%;
	}
	.expanded {
		border-left: 1px solid var(--color-border-2);
		margin-left: 7px;
	}

	.dir {
		padding: 0;
		font-size: 0.8rem;
		color: var(--color-bg-primary);
		font-weight: 500;
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.header {
		display: flex;
		width: 100%;
		column-gap: 5px;
		padding: 0.2rem 0;
		border-radius: var(--border-radius-medium);
		background-color: inherit;
		color: var(--color-text-3);
		align-items: center;
		position: relative;

		*:first-child {
			flex: 1;
		}

		button {
			background-color: transparent;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		:global(svg) {
			stroke-width: 2px;
			background-color: inherit;
			stroke: var(--color-text-3);
		}
	}

	.file-list {
		padding-left: 0.2rem;
		list-style-type: none;
		font-size: 1rem;

		li {
			padding: 0.3rem;

			a {
				display: flex;
				column-gap: 5px;
				align-items: center;
				text-decoration: none;
				font-size: 0.8rem;

				:global(svg) {
					width: 14px;
				}

				p {
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>
