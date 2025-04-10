import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// This is a simplified middleware for demo purposes
// In a real application, you would verify JWT tokens or session cookies
export async function middleware(request: NextRequest) {
  // Get token from NextAuth.js
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isLoggedIn = !!token
  const userRole = token?.role || null
  const path = request.nextUrl.pathname

  // Redirect to login if not logged in and trying to access protected routes
  if (!isLoggedIn && path !== "/" && path !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to appropriate dashboard if logged in and accessing login page
  if (isLoggedIn && (path === "/" || path === "/login")) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else if (userRole === "hr") {
      return NextResponse.redirect(new URL("/hr/dashboard", request.url))
    } else if (userRole === "team_lead") {
      return NextResponse.redirect(new URL("/team-lead/dashboard", request.url))
    } else if (userRole === "employee") {
      return NextResponse.redirect(new URL("/employee/dashboard", request.url))
    } else {
      // Fallback to a generic dashboard if role is unknown
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Role-based access control for specific route groups
  if (isLoggedIn && userRole) {
    // Admin routes
    if (path.startsWith("/admin") && userRole !== "admin") {
      if (userRole === "hr") {
        return NextResponse.redirect(new URL("/hr/dashboard", request.url))
      } else if (userRole === "team_lead") {
        return NextResponse.redirect(new URL("/team-lead/dashboard", request.url))
      } else if (userRole === "employee") {
        return NextResponse.redirect(new URL("/employee/dashboard", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // HR routes
    if (path.startsWith("/hr") && userRole !== "hr" && userRole !== "admin") {
      if (userRole === "team_lead") {
        return NextResponse.redirect(new URL("/team-lead/dashboard", request.url))
      } else if (userRole === "employee") {
        return NextResponse.redirect(new URL("/employee/dashboard", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // Team Lead routes
    if (path.startsWith("/team-lead") && userRole !== "team_lead" && userRole !== "admin") {
      if (userRole === "hr") {
        return NextResponse.redirect(new URL("/hr/dashboard", request.url))
      } else if (userRole === "employee") {
        return NextResponse.redirect(new URL("/employee/dashboard", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // Employee routes
    if (path.startsWith("/employee") && 
        userRole !== "employee" && 
        userRole !== "team_lead" && 
        userRole !== "hr" && 
        userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Auth API routes)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|api|_next/static|_next/image|favicon.ico).*)",
  ],
}
