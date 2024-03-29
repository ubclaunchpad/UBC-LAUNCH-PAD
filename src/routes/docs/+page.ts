import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		const name = 'index';
		const post = await import(`../../docs/${name}.md`);
		const content = post.default;
		return {
			content
		};
	} catch (e) {
		console.log(e);
	}
};

export const prerender = true;
