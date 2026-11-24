import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedPosts, postPath } from '@/lib/content';
import { fillPrices } from '@/data/pricing';

export async function GET(context: APIContext) {
  const posts = await publishedPosts();
  return rss({
    title: 'Works AI blog',
    description: 'Plain-English guides on AI, websites and SEO for UK small businesses.',
    site: context.site!,
    trailingSlash: true,
    customData: '<language>en-gb</language>',
    items: posts.map((p) => ({
      title: p.data.h1,
      description: fillPrices(p.data.description),
      pubDate: p.data.published,
      link: postPath(p),
      categories: [p.data.category],
    })),
  });
}
