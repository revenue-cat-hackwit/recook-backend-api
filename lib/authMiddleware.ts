// @/lib/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'
import { withCors } from './cors'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export function withAuth(
  handler: (req: AuthenticatedRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: AuthenticatedRequest, context?: any) => {
    return withCors(req, async () => {
      try {
        // Get token from Authorization header
        const authHeader = req.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json(
            { success: false, message: 'Unauthorized - No token provided' },
            { status: 401 }
          )
        }

        const token = authHeader.substring(7) // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token)

        if (!decoded) {
          return NextResponse.json(
            { success: false, message: 'Unauthorized - Invalid token' },
            { status: 401 }
          )
        }

        // Attach user to request
        req.user = decoded

        // Call the actual handler with context (includes params)
        return handler(req, context)
      } catch (error) {
        console.error('Auth middleware error:', error)
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      }
    })
  }
}
