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

    if (error instanceof Error) {
      // Supabaseのエラーメッセージをそのまま利用
      message = error.message;
    }

    // if (error instanceof Error) {
    //   // 特定のエラーメッセージに基づいてステータスコードを設定
    //   if (error.message === 'データが取得できませんでした') {
    //     status = 404;
    //     message = 'データが見つかりません';
    //   } else {
    //     message = '内部サーバーエラー';
    //   }
    // }

    return NextResponse.json({ error: message }, { status });
  }
}
