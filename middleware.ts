// source -> https://labs.convex.dev/auth/authz/nextjs
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isSignInPage = createRouteMatcher(["/signin"])
const isProtectedRoute = createRouteMatcher(["/portal(.*)"])

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
      // console.log({ request })
      return nextjsMiddlewareRedirect(request, "/portal")
    }
    if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/signin")
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 7 } },
) // 7 days / 1 week

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
