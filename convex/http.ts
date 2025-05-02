import { httpRouter } from "convex/server" // Convex’s built-in HTTP router:contentReference[oaicite:0]{index=0}
import { auth } from "./auth" // Your convex-auth config:contentReference[oaicite:1]{index=1}

const http = httpRouter() // ✔ Create the router:contentReference[oaicite:2]{index=2}

// Mount all OAuth/JWT endpoints & OpenID config
auth.addHttpRoutes(http) // ✔ Wire up /api/auth/signin/*, /api/auth/callback/*, /.well-known/*:contentReference[oaicite:3]{index=3}

// (Optionally) define more routes here via http.route({ … })

export default http // Convex expects this default export:contentReference[oaicite:4]{index=4}
