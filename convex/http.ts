import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono"
import { Hono } from "hono"
import { prettyJSON } from "hono/pretty-json"
import { api } from "./_generated/api"
import { ActionCtx } from "./_generated/server"

// Initialize Hono with Convex context
const app: HonoWithConvex<ActionCtx> = new Hono()
app.use(prettyJSON()) // With options: prettyJSON({ space: 4 })

// Define your routes
app.get("/", (c) => {
  return c.text("Hello from Convex + Hono!")
})

app.get("/api/pooltables/:companyId", async (c) => {
  const companyIdParam = c.req.param("companyId")

  // Use normalizeId to validate and convert the string to a proper Convex ID
  const companyId = await c.env.runQuery(api.helpers.normalizeCompanyId, {
    id: companyIdParam,
  })

  if (!companyId) {
    return c.json({ error: "Invalid ID format" }, 400)
  }

  const poolTables = await c.env.runQuery(
    api.poolTables.findAllPublicProcedure,
    { companyId },
  )

  return c.json(poolTables || { error: "Not found" })
})

// Add CORS middleware to all API routes
import { cors } from "hono/cors"
import { Id } from "./_generated/dataModel"
app.use(
  "/api/*",
  cors({
    origin: ["https://qozycue.com", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)

// Custom 404 response
app.notFound((c) => {
  return c.json({ error: "Endpoint not found" }, 404)
})

// Export the router
export default new HttpRouterWithHono(app)
