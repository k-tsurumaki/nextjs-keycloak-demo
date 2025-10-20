// クライアントサイドでのみ実行されることを明示
"use client"

// NextAuth.jsのセッション管理とサインアウト機能をインポート
import { useSession, signOut } from "next-auth/react"

/**
 * ホームページコンポーネント
 * 認証されたユーザーの情報を表示し、ログアウト機能を提供
 */
export default function Home() {
  // セッション情報とステータスを取得
  const { data: session, status } = useSession()

  // セッション読み込み中の表示
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">読み込み中...</p>
      </div>
    )
  }

  // 未認証状態の表示（通常はミドルウェアでリダイレクトされるため表示されない）
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">認証されていません</p>
      </div>
    )
  }

  // 認証済みユーザーのメイン画面
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* ユーザー名を含む挨拶メッセージ */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Hello {session.user?.name || session.user?.email || 'ユーザー'}!
        </h1>

        {/* 認証成功メッセージ */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">Keycloakでの認証が成功しました。</p>
        </div>

        <div className="space-y-4">
          {/* ユーザー情報表示セクション */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold text-gray-700 mb-2">ユーザー情報:</h3>
            <p><strong>名前:</strong> {session.user?.name || 'N/A'}</p>
            <p><strong>メール:</strong> {session.user?.email || 'N/A'}</p>
          </div>

          {/* ログアウトボタン */}
          <button
            onClick={() => signOut()}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
}
