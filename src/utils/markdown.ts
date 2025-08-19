import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import matter from 'gray-matter';

export interface MarkdownFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  category?: string;
  icon?: string;
  slug?: string;
  draft?: boolean;
  order?: number;
  [key: string]: any;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface ParsedMarkdown {
  frontmatter: MarkdownFrontmatter;
  content: string;
  htmlContent: string;
  excerpt?: string;
  slug: string;
  filePath: string;
  tableOfContents?: TableOfContentsItem[];
  readingTime?: number;
}

export interface DocumentNode {
  name: string;
  path: string;
  slug: string;
  isDirectory: boolean;
  children?: DocumentNode[];
  markdown?: ParsedMarkdown;
}

// 配置 marked 选项和扩展
marked.use(
  gfmHeadingId(),
  {
    gfm: true,
    breaks: false,
    pedantic: false,
    renderer: {
      // 自定义表格渲染
      table(token) {
        const header = token.header.map(cell => `<th>${cell.text}</th>`).join('');
        const body = token.rows.map(row =>
          `<tr>${row.map(cell => `<td>${cell.text}</td>`).join('')}</tr>`
        ).join('');

        return `<div class="table-wrapper">
          <table class="enhanced-table">
            <thead><tr>${header}</tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>`;
      },
      // 自定义代码块渲染
      code(token) {
        const code = token.text;
        const language = token.lang || 'text';
        const displayLang = language.charAt(0).toUpperCase() + language.slice(1);

        return `<div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-block-language">${displayLang}</span>
            <button class="code-copy-btn" data-code="${encodeURIComponent(code)}">
              <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="m5 15-4-4 4-4"></path>
              </svg>
              复制
            </button>
          </div>
          <pre class="code-block"><code class="hljs language-${language}">${code}</code></pre>
        </div>`;
      },
      // 自定义引用块渲染
      blockquote(token) {
        const quote = token.text;

        // 检测特殊类型的引用块
        const alertTypes = {
          '⚠️': 'warning',
          '💡': 'tip',
          '❗': 'danger',
          '📝': 'note',
          '✅': 'success',
          '🔥': 'important'
        };

        for (const [emoji, type] of Object.entries(alertTypes)) {
          if (quote.includes(emoji)) {
            return `<div class="alert alert-${type}">
              <div class="alert-icon">${emoji}</div>
              <div class="alert-content">${quote.replace(new RegExp(`<p>${emoji}\\s*`, 'g'), '<p>')}</div>
            </div>`;
          }
        }

        return `<blockquote class="enhanced-blockquote">${quote}</blockquote>`;
      }
    }
  }
);

/**
 * 生成目录结构
 * @param content Markdown内容
 * @returns 目录结构数组
 */
function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headings: TableOfContentsItem[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    headings.push({
      id,
      text,
      level,
      children: []
    });
  }

  // 构建层级结构
  const buildHierarchy = (items: TableOfContentsItem[]): TableOfContentsItem[] => {
    const result: TableOfContentsItem[] = [];
    const stack: TableOfContentsItem[] = [];

    for (const item of items) {
      // 找到合适的父级
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        result.push(item);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) parent.children = [];
        parent.children.push(item);
      }

      stack.push(item);
    }

    return result;
  };

  return buildHierarchy(headings);
}

/**
 * 计算阅读时间（基于中文阅读速度）
 * @param content Markdown内容
 * @returns 预估阅读时间（分钟）
 */
function calculateReadingTime(content: string): number {
  // 移除代码块和其他非正文内容
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/#+ /g, '') // 移除标题标记
    .replace(/[*_]{1,2}(.*?)[*_]{1,2}/g, '$1') // 移除粗体斜体标记
    .replace(/\n+/g, ' ') // 合并换行
    .trim();

  // 中文字符数
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 英文单词数
  const englishWords = cleanContent.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(word => word.length > 0).length;

  // 中文阅读速度：约300字/分钟，英文阅读速度：约200词/分钟
  const readingTime = Math.ceil((chineseChars / 300) + (englishWords / 200));

  return Math.max(1, readingTime); // 至少1分钟
}

/**
 * 解析 Markdown 文件的 frontmatter 和内容
 * @param filePath 文件路径
 * @returns 解析后的 frontmatter 和内容
 */
export function parseMarkdownFile(filePath: string): ParsedMarkdown | null {
  try {
    if (!existsSync(filePath)) {
      console.warn(`Markdown file not found: ${filePath}`);
      return null;
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const slug = generateSlugFromPath(filePath);
    return parseMarkdownContent(fileContent, slug, filePath);
  } catch (error) {
    console.error(`Error reading markdown file ${filePath}:`, error);
    return null;
  }
}

/**
 * 解析 Markdown 内容字符串
 * @param content Markdown 内容
 * @param slug 文档 slug
 * @param filePath 文件路径
 * @returns 解析后的 frontmatter 和内容
 */
export function parseMarkdownContent(
  content: string,
  slug: string = '',
  filePath: string = ''
): ParsedMarkdown {
  try {
    // 使用 gray-matter 解析 frontmatter
    const { data: frontmatter, content: markdownContent } = matter(content);

    // 如果没有标题，尝试从内容中提取
    if (!frontmatter.title) {
      const lines = markdownContent.split('\n');
      const titleMatch = lines.find(line => line.startsWith('# '));
      if (titleMatch) {
        frontmatter.title = titleMatch.replace('# ', '').trim();
      }
    }

    // 生成摘要
    const excerpt = extractExcerpt(markdownContent);

    // 生成目录
    const tableOfContents = generateTableOfContents(markdownContent);

    // 计算阅读时间
    const readingTime = calculateReadingTime(markdownContent);

    // 转换为 HTML
    const htmlContent = marked.parse(markdownContent.trim()) as string;

    return {
      frontmatter: frontmatter as MarkdownFrontmatter,
      content: markdownContent.trim(),
      htmlContent,
      excerpt,
      slug: frontmatter.slug || slug,
      filePath,
      tableOfContents,
      readingTime
    };
  } catch (error) {
    console.error(`Error parsing markdown content:`, error);

    // 回退处理
    const lines = content.split('\n');
    const titleMatch = lines.find(line => line.startsWith('# '));
    const title = titleMatch ? titleMatch.replace('# ', '').trim() : '未知文档';

    return {
      frontmatter: { title },
      content: content.trim(),
      htmlContent: marked.parse(content.trim()) as string,
      excerpt: extractExcerpt(content),
      slug,
      filePath
    };
  }
}

/**
 * 从文件路径生成 slug
 * @param filePath 文件路径
 * @returns slug
 */
function generateSlugFromPath(filePath: string): string {
  const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/');
  const pathParts = relativePath.split('/').filter(part => part && part !== 'public' && part !== 'docs');
  const fileName = pathParts[pathParts.length - 1];
  const nameWithoutExt = fileName ? fileName.replace(/\.md$/, '') : '';

  if (pathParts.length > 1) {
    pathParts[pathParts.length - 1] = nameWithoutExt;
    return pathParts.join('/');
  }

  return nameWithoutExt;
}

/**
 * 提取文档摘要（前150个字符）
 * @param content Markdown 内容
 * @returns 摘要文本
 */
function extractExcerpt(content: string, maxLength: number = 150): string {
  // 移除 Markdown 标记
  const plainText = content
    .replace(/^#+\s+/gm, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
    .replace(/`(.*?)`/g, '$1') // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n+/g, ' ') // 将换行符替换为空格
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * 读取文档目录下的 Markdown 文件
 * @param relativePath 相对于 public/docs 的路径
 * @returns 解析后的 Markdown 内容
 */
export function readDocsMarkdown(relativePath: string): ParsedMarkdown | null {
  const fullPath = join(process.cwd(), 'public/docs', relativePath);
  return parseMarkdownFile(fullPath);
}

/**
 * 获取文档首页内容
 * @returns 文档首页的 Markdown 内容
 */
export function getDocsIndexContent(): ParsedMarkdown | null {
  return readDocsMarkdown('README.md');
}

/**
 * 扫描文档目录，生成文档树结构
 * @param dirPath 目录路径
 * @param basePath 基础路径
 * @returns 文档节点数组
 */
export function scanDocsDirectory(
  dirPath: string = join(process.cwd(), 'public/docs'),
  basePath: string = ''
): DocumentNode[] {
  const nodes: DocumentNode[] = [];

  try {
    if (!existsSync(dirPath)) {
      console.warn(`Directory not found: ${dirPath}`);
      return nodes;
    }

    const items = readdirSync(dirPath);

    for (const item of items) {
      const itemPath = join(dirPath, item);
      const stat = statSync(itemPath);
      const relativePath = basePath ? `${basePath}/${item}` : item;

      if (stat.isDirectory()) {
        // 递归扫描子目录
        const children = scanDocsDirectory(itemPath, relativePath);
        nodes.push({
          name: item,
          path: relativePath,
          slug: relativePath,
          isDirectory: true,
          children
        });
      } else if (extname(item) === '.md') {
        // 解析 Markdown 文件
        const markdown = parseMarkdownFile(itemPath);
        if (markdown) {
          nodes.push({
            name: basename(item, '.md'),
            path: relativePath,
            slug: markdown.slug,
            isDirectory: false,
            markdown
          });
        }
      }
    }

    // 按 order 字段排序，然后按名称排序
    nodes.sort((a, b) => {
      const orderA = a.markdown?.frontmatter.order ?? 999;
      const orderB = b.markdown?.frontmatter.order ?? 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.name.localeCompare(b.name);
    });

  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }

  return nodes;
}

/**
 * 根据 slug 查找文档
 * @param slug 文档 slug
 * @returns 找到的文档内容
 */
export function findDocumentBySlug(slug: string): ParsedMarkdown | null {
  const docsTree = scanDocsDirectory();

  function searchInNodes(nodes: DocumentNode[]): ParsedMarkdown | null {
    for (const node of nodes) {
      if (!node.isDirectory && node.markdown && node.slug === slug) {
        return node.markdown;
      }

      if (node.isDirectory && node.children) {
        const found = searchInNodes(node.children);
        if (found) return found;
      }
    }
    return null;
  }

  return searchInNodes(docsTree);
}

/**
 * 获取所有文档的列表（扁平化）
 * @returns 所有文档的数组
 */
export function getAllDocuments(): ParsedMarkdown[] {
  const docsTree = scanDocsDirectory();
  const documents: ParsedMarkdown[] = [];

  function collectDocuments(nodes: DocumentNode[]) {
    for (const node of nodes) {
      if (!node.isDirectory && node.markdown) {
        documents.push(node.markdown);
      }

      if (node.isDirectory && node.children) {
        collectDocuments(node.children);
      }
    }
  }

  collectDocuments(docsTree);
  return documents;
}

/**
 * 生成动态导航配置
 * 基于文件系统结构生成导航
 */
export function generateDocsNavigation() {
  const docsTree = scanDocsDirectory();
  const navigation: any[] = [];

  for (const node of docsTree) {
    if (node.isDirectory && node.children) {
      const section = {
        title: node.markdown?.frontmatter.title || formatTitle(node.name),
        items: [] as any[]
      };

      for (const child of node.children) {
        if (!child.isDirectory && child.markdown) {
          section.items.push({
            name: child.markdown.frontmatter.title || formatTitle(child.name),
            href: `/docs/${child.slug}`,
            icon: child.markdown.frontmatter.icon || '📄'
          });
        }
      }

      if (section.items.length > 0) {
        navigation.push(section);
      }
    } else if (!node.isDirectory && node.markdown) {
      // 顶级文档
      if (!navigation.find(section => section.title === '开始使用')) {
        navigation.unshift({
          title: '开始使用',
          items: []
        });
      }

      navigation[0].items.push({
        name: node.markdown.frontmatter.title || formatTitle(node.name),
        href: `/docs/${node.slug}`,
        icon: node.markdown.frontmatter.icon || '📖'
      });
    }
  }

  return navigation;
}

/**
 * 格式化标题（将文件名转换为可读标题）
 * @param name 文件名
 * @returns 格式化后的标题
 */
function formatTitle(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * 获取相关文档推荐
 * @param currentSlug 当前文档的 slug
 * @param limit 推荐数量限制
 * @returns 相关文档数组
 */
export function getRelatedDocuments(currentSlug: string, limit: number = 3): ParsedMarkdown[] {
  const allDocs = getAllDocuments();
  const currentDoc = allDocs.find(doc => doc.slug === currentSlug);

  if (!currentDoc) return [];

  // 简单的相关性算法：基于标签和分类
  const related = allDocs
    .filter(doc => doc.slug !== currentSlug)
    .map(doc => {
      let score = 0;

      // 相同分类加分
      if (doc.frontmatter.category === currentDoc.frontmatter.category) {
        score += 3;
      }

      // 相同标签加分
      const currentTags = currentDoc.frontmatter.tags || [];
      const docTags = doc.frontmatter.tags || [];
      const commonTags = currentTags.filter(tag => docTags.includes(tag));
      score += commonTags.length * 2;

      return { doc, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.doc);

  return related;
}
