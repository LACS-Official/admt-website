import { put, list } from '@vercel/blob';

export const prerender = false;

/**
 * macOS 兴趣投票接口 - 增强调试版
 */

const POLL_FILENAME = 'macos_poll_count.json';

// 获取当前计数的逻辑
async function getCount() {
  try {
    const { blobs } = await list({ 
      prefix: POLL_FILENAME,
    });
    
    // 查找精确匹配的文件名
    const pollBlob = blobs.find(b => b.pathname === POLL_FILENAME);

    if (!pollBlob) {
      console.log('No poll file found in Blob storage, starting from 0');
      return 0;
    }

    // 获取文件内容，添加缓存抑制
    const response = await fetch(`${pollBlob.url}?t=${Date.now()}`);
    if (!response.ok) return 0;
    
    const data = await response.json();
    return Number(data.count) || 0;
  } catch (error) {
    console.error('Blob Read Error in getCount:', error);
    return 0;
  }
}

export async function GET() {
  try {
    const count = await getCount();
    return new Response(
      JSON.stringify({ count }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0"
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ count: 0, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST() {
  try {
    // 检查环境变量是否存在
    const token = process.env.BLOB_READ_WRITE_TOKEN || import.meta.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('Environment variable BLOB_READ_WRITE_TOKEN is missing');
    }

    // 1. 获取当前值
    const currentCount = await getCount();
    const newCount = currentCount + 1;

    console.log(`Updating vote count from ${currentCount} to ${newCount}`);

    // 2. 写入新值
    const blob = await put(POLL_FILENAME, JSON.stringify({ count: newCount }), {
      access: 'public',
      addRandomSuffix: false, // 覆盖旧文件路径
      allowOverwrite: true // 允许覆盖同名文件
    });

    console.log(`Successfully updated Blob at: ${blob.url}`);

    return new Response(
      JSON.stringify({ success: true, count: newCount }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error('Detailed Blob Write Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        tip: "Please check if BLOB_READ_WRITE_TOKEN is correctly set in Vercel dashboard."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
