import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"

// This creates the API route handler for NextAuth
const handler = NextAuth(authOptions)

// Export the handler for GET and POST requests
export { handler as GET, handler as POST }

