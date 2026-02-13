import { put, list, del } from '@vercel/blob';

export const prerender = false;

/**
 * macOS 兴趣投票接口
 * 使用 Vercel Blob 进行永久存储
 */

const POLL_FILENAME = 'macos_poll_count.json';

// 获取当前计数的逻辑
async function getCount() {
  try {
    const { blobs } = await list({ prefix: POLL_FILENAME });
    const pollBlob = blobs.find(b => b.pathname === POLL_FILENAME);

    if (!pollBlob) return 0;

    const response = await fetch(pollBlob.url);
    const data = await response.json();
    return Number(data.count) || 0;
  } catch (error) {
    console.error('Blob Read Error:', error);
    return 0;
  }
}

export async function GET() {
  const count = await getCount();
  return new Response(
    JSON.stringify({ count }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}

export async function POST() {
  try {
    // 1. 获取当前值
    const currentCount = await getCount();
    const newCount = currentCount + 1;

    // 2. 写入新值 (Vercel Blob put 会覆盖同名路径，但需要注意 pathname)
    // 注意：Blob 存储更新同名文件实际上是创建了新 URL，但 pathname 保持一致则可以通过 list 找到最新的
    await put(POLL_FILENAME, JSON.stringify({ count: newCount }), {
      access: 'public',
      addRandomSuffix: false // 确保 pathname 固定，方便查找
    });

    return new Response(
      JSON.stringify({ success: true, count: newCount }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error('Blob Write Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: "Storage failed." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
