// NextAuth.jsの型定義を拡張
import NextAuth from "next-auth"

// NextAuth.jsのSession型を拡張してカスタムプロパティを追加
declare module "next-auth" {
  interface Session {
    accessToken?: string  // Keycloakのアクセストークン（API呼び出し用）
    idToken?: string      // KeycloakのIDトークン（ユーザー情報含む）
  }
}

// NextAuth.jsのJWT型を拡張してカスタムプロパティを追加
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string  // Keycloakのアクセストークン
    idToken?: string      // KeycloakのIDトークン
    user?: any           // ユーザー情報オブジェクト
  }
}