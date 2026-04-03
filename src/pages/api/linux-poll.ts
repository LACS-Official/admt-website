import { put, list } from "@vercel/blob";

export const prerender = false;

/**
 * Linux 兴趣助力接口
 */

const POLL_FILENAME = "linux_poll_count.json";

// 获取当前计数的逻辑
async function getCount() {
  try {
    const token =
      process.env.BLOB_READ_WRITE_TOKEN ||
      import.meta.env.BLOB_READ_WRITE_TOKEN;
    if (!token || typeof token !== "string") {
      return 0; // Local fallback
    }
    const { blobs } = await list({
      prefix: POLL_FILENAME,
      token: token,
    });

    // 查找精确匹配的文件名
    const pollBlob = blobs.find((b) => b.pathname === POLL_FILENAME);

    if (!pollBlob) {
      console.log("No Linux poll file found in Blob storage, starting from 0");
      return 0;
    }

    // 获取文件内容，添加缓存抑制
    const response = await fetch(`${pollBlob.url}?t=${Date.now()}`);
    if (!response.ok) return 0;

    const data = await response.json();
    return Number(data.count) || 0;
  } catch (error) {
    console.error("Blob Read Error in getCount (Linux):", error);
    return 0;
  }
}

export async function GET() {
  try {
    const count = await getCount();
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ count: 0, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST() {
  try {
    // 检查环境变量是否存在
    const token =
      process.env.BLOB_READ_WRITE_TOKEN ||
      import.meta.env.BLOB_READ_WRITE_TOKEN;
    
    // 开发环境 fallback: 如果缺少 Token，则进行 Mock 响应
    if (!token) {
      console.warn("BLOB_READ_WRITE_TOKEN is missing. Running in Mock mode (Local Dev).");
      const currentCount = Math.floor(Math.random() * 100); // 模拟一个当前值
      return new Response(JSON.stringify({ success: true, count: currentCount + 1, isMock: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. 获取当前值
    const currentCount = await getCount();
    const newCount = currentCount + 1;

    console.log(
      `Updating Linux vote count from ${currentCount} to ${newCount}`,
    );

    // 2. 写入新值
    const blob = await put(POLL_FILENAME, JSON.stringify({ count: newCount }), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: token,
    });

    console.log(`Successfully updated Linux Blob at: ${blob.url}`);

    return new Response(JSON.stringify({ success: true, count: newCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Detailed Linux Blob Write Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        tip: "Please check if BLOB_READ_WRITE_TOKEN is correctly set in Vercel dashboard.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
