// NextAuth.jsの必要なモジュールをインポート
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import KeycloakProvider from "next-auth/providers/keycloak"

// アプリケーションのベースURL（環境変数から読み込み）
const APP_BASE_URL = process.env.NEXTAUTH_URL!

// NextAuth.jsの設定オプション
export const authOptions: NextAuthOptions = {
  // 認証プロバイダーの設定
  providers: [
    // Keycloak OIDC認証プロバイダー
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,         // クライアントID (nextjs-keycloak-demo)
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!, // クライアントシークレット
      issuer: process.env.KEYCLOAK_ISSUER!,              // Keycloakのレルム エンドポイント
    })
  ],
  // カスタムコールバック関数の定義
  callbacks: {
    // JWTトークンコールバック: ログイン時と更新時に実行される
    async jwt({ token, account, user }) {
      // 初回ログイン時: Keycloakから取得したトークンを保存
      if (account) {
        token.accessToken = account.access_token  // API呼び出し用アクセストークン
        token.idToken = account.id_token          // ユーザー情報を含むIDトークン
      }
      // ユーザー情報をJWTトークンに保存
      if (user) {
        token.user = user
      }
      return token
    },
    // セッションコールバック: クライアントサイドでセッション情報を取得する際に実行
    async session({ session, token }) {
      // JWTトークンからセッションオブジェクトにデータを移行
      session.accessToken = token.accessToken as string // アクセストークンをセッションに追加
      session.idToken = token.idToken as string          // IDトークンをセッションに追加
      session.user = token.user as any                   // ユーザー情報をセッションに追加
      return session
    },
    // リダイレクト先を環境変数から読み込み
    async redirect({ url, baseUrl }) {
      // 認証成功後のリダイレクト先を環境変数から取得
      const redirectUrl = APP_BASE_URL  // NEXTAUTH_URLから読み込まれた値を使用
      
      // 相対URLの場合は環境変数で指定されたベースURLと結合
      if (url.startsWith("/")) {
        return `${redirectUrl}${url}`
      }
      
      // 同一ドメインの場合はそのまま
      if (new URL(url).origin === redirectUrl) {
        return url
      }
      
      // デフォルト: 環境変数で指定されたURLにリダイレクト
      return redirectUrl
    },
  },
  // セッション管理の設定
  session: {
    strategy: "jwt", // JWTトークンベースのセッション管理を使用（データベース不要）
  },
  // NextAuth.js署名用の秘密鍵（環境変数から取得）
  secret: process.env.NEXTAUTH_SECRET,
}

// NextAuth.jsハンドラーを作成
const handler = NextAuth(authOptions)

// Next.js App RouterのGET/POSTリクエストハンドラーとしてエクスポート
export { handler as GET, handler as POST }