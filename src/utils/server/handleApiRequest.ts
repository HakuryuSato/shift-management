import { NextResponse } from 'next/server';

/**
 * APIリクエストのエラーハンドリングを共通化する関数
 * @param handler APIロジックを含む非同期関数
 * @returns NextResponseオブジェクト
 */
export async function handleApiRequest<T>(handler: () => Promise<T>): Promise<NextResponse> {
  try {
    const data = await handler();
    return NextResponse.json({ data }, { status: 200 });

  } catch (error: unknown) {
    let message = 'サーバーエラーが発生しました';
    let status = 500;

    // supabaseのエラーをそのまま返す
    if (error instanceof Error) {
      message = error.message;
    }



    return NextResponse.json({ error: message }, { status });
  }
}
