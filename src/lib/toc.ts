import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import type { Node } from "unist";
import type { Root } from "mdast";

const textTypes = ["text", "emphasis", "strong", "inlineCode"] as const;

// mdast 节点类型
type MdastNode = Node & {
  type: string;
  children?: MdastNode[];
  value?: string;
  url?: string;
};

function flattenNode(node: MdastNode): string {
  const p: string[] = [];
  visit(node, (node: MdastNode) => {
    if (!textTypes.includes(node.type as typeof textTypes[number])) return;
    if (node.value) {
      p.push(node.value);
    }
  });
  return p.join(``);
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

function getItems(node: MdastNode | null, current: Partial<Item>): Partial<Item> {
  if (!node) {
    return current;
  }

  if (node.type === "paragraph") {
    visit(node, (item: MdastNode) => {
      if (item.type === "link") {
        current.url = item.url || "";
        current.title = flattenNode(node);
      }

      if (item.type === "text") {
        current.title = flattenNode(node);
      }
    });

    return current;
  }

  if (node.type === "list") {
    current.items = node.children?.map((i: MdastNode) => getItems(i, {}) as Item) || [];

    return current;
  } else if (node.type === "listItem") {
    const heading = getItems(node.children?.[0] || null, {}) as Item;

    if (node.children && node.children.length > 1) {
      getItems(node.children[1], heading);
    }

    return heading;
  }

  return current;
}

const getToc = () => (node: Root, file: { data: unknown }) => {
  const table = toc(node);
  const items = getItems(table.map || null, {});

  file.data = items;
};

export type TableOfContents = Items;

export async function getTableOfContents(
  content: string
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content);

  return result.data as TableOfContents;
}
