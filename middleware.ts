import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // CSRF protection for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const origin = request.headers.get('origin')
        const host = request.headers.get('host')

        // Check if request is from same origin
        if (origin && !origin.includes(host || '')) {
            return NextResponse.json(
                { error: 'CSRF validation failed' },
                { status: 403 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}
