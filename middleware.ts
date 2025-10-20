// Next.jsミドルウェア用のモジュールをインポート
import { NextRequest, NextResponse } from "next/server"
// NextAuth.jsのJWTトークン取得機能をインポート
import { getToken } from "next-auth/jwt"

// 全てのリクエストに対して実行されるミドルウェア関数
export async function middleware(request: NextRequest) {
  // 認証不要なパスへのアクセスは許可
  if (
    request.nextUrl.pathname.startsWith('/api/auth') || // NextAuth.js認証API
    request.nextUrl.pathname === '/login'               // ログインページ
  ) {
    return NextResponse.next()
  }

  // リクエストからJWTトークンを取得・検証
  const token = await getToken({
    req: request,                            // リクエストオブジェクト
    secret: process.env.NEXTAUTH_SECRET,     // JWT署名検証用の秘密鍵
  })

  // 認証されていない場合はサインインページにリダイレクト
  if (!token && request.nextUrl.pathname !== '/login') {
    const loginUrl = new URL('/api/auth/signin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 認証済みの場合はリクエストを続行
  return NextResponse.next()
}

// ミドルウェアが適用されるパスのパターンを定義
export const config = {
  matcher: [
    /*
     * 以下で始まるパス以外の全てのリクエストパスにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico (ファビコンファイル)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}