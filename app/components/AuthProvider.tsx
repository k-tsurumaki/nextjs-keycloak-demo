// クライアントサイドでのみ実行されることを明示
"use client"

// NextAuth.jsのセッション管理プロバイダーをインポート
import { SessionProvider } from "next-auth/react"

/**
 * 認証プロバイダーコンポーネント
 * アプリケーション全体でNextAuth.jsのセッション情報を共有するためのコンテキストプロバイダー
 * 
 * @param children - 子コンポーネント（アプリケーション全体）
 * @returns SessionProviderでラップされた子コンポーネント
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>
}