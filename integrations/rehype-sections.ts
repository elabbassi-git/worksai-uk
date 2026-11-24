type El = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: El[]; value?: string };

/**
 * Wraps each <h2> and the content after it in <section class="md-cell">, so service
 * pages can lay Markdown out as a bento grid of cards instead of a wall of text.
 * Cells are tagged with what they contain (list, steps, table) for styling.
 */
export function rehypeSections() {
  return (tree: El) => {
    const out: El[] = [];
    let cell: El | null = null;
    for (const node of tree.children ?? []) {
      if (node.type === 'element' && node.tagName === 'h2') {
        cell = { type: 'element', tagName: 'section', properties: { className: ['md-cell'] }, children: [] };
        out.push(cell);
      }
      (cell ? cell.children! : out).push(node);
    }
    for (const c of out) {
      if (c.tagName !== 'section') continue;
      const tags = new Set((c.children ?? []).filter((n) => n.type === 'element').map((n) => n.tagName));
      const cls = c.properties!.className as string[];
      if (tags.has('ul')) cls.push('has-list');
      if (tags.has('ol')) cls.push('has-steps');
      if (tags.has('table')) cls.push('has-table');
    }
    tree.children = out;
  };
}
