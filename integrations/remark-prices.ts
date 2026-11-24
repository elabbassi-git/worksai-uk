import { fillPrices } from '../src/data/pricing.ts';

type Node = { type: string; value?: string; children?: Node[] };

/** Replaces [[price:...]] style tokens in Markdown text with values from src/data/pricing.ts. */
export function remarkPrices() {
  return (tree: Node) => {
    const walk = (node: Node) => {
      if ((node.type === 'text' || node.type === 'inlineCode') && node.value?.includes('[[')) {
        node.value = fillPrices(node.value);
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
