'use server';

/**
 * サーバーアクションのエラーハンドリングを共通化する関数
 * @param action 実行するサーバーアクション
 * @returns アクションの結果
 * @throws エラーが発生した場合
 */
export async function handleServerAction<T>(action: () => Promise<T>): Promise<T> {
  try {
    const result = await action();
    return result;
  } catch (error) {
    console.error('Error in server action:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('サーバーアクション中に不明なエラーが発生しました');
    }
  }
}
