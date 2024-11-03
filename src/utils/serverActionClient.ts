// サーバーアクションのエラーハンドリングを共通化する関数
export async function handleServerAction<T>(action: () => Promise<T>): Promise<T | null> {
    try {
      const data = await action();
      return data;
    } catch (error: any) {
      console.error('サーバーアクション実行中にエラーが発生しました:', error.message || error);
      // 必要に応じてユーザーへのエラーメッセージ表示やログ送信を行う
      return null;
    }
  }

  