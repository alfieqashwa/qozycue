import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    image: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("DEWA"),
        v.literal("ADMIN"),
        v.literal("OWNER"),
        v.literal("MANAGER"),
        v.literal("CASHIER"),
        v.literal("USER"),
      ),
    ),
    pinCode: v.optional(v.number()),
    companyId: v.optional(v.id("companies")), // exception set this to optional
  })
    .index("email", ["email"])
    .index("role", ["role"])
    .index("companyId", ["companyId"]),

  companies: defineTable({
    name: v.string(),
    slug: v.string(),
    phone: v.string(),
    logo: v.optional(v.string()),
    location: v.string(),
    isPublished: v.boolean(),
    subscription: v.union(
      v.literal("TRIAL"),
      v.literal("BASIC"),
      v.literal("PRO"),
      v.literal("ENTERPRISE"),
    ),
  }).index("by_slug", ["slug"]),

  taxes: defineTable({
    name: v.string(),
    value: v.float64(),
    isDefaultValue: v.boolean(),
    companyId: v.id("companies"),
  }).index("companyId", ["companyId"]),

  discounts: defineTable({
    name: v.string(),
    value: v.float64(),
    isDefaultValue: v.boolean(),
    companyId: v.id("companies"),
  }).index("companyId", ["companyId"]),

  customers: defineTable({
    name: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("FEMALE"), v.literal("MALE"))),
    companyId: v.id("companies"),
  })
    .index("companyId", ["companyId"])
    .index("by_name", ["name"]),

  poolTables: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    status: v.union(v.literal("disabled"), v.literal("enabled")),
    startTime: v.union(v.float64(), v.null()),
    endTime: v.union(v.float64(), v.null()),
    gapDuration: v.number(),
    companyId: v.id("companies"),
  }).index("companyId", ["companyId"]),

  // packets is similar to products
  packets: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    cost: v.float64(),
    status: v.union(v.literal("disabled"), v.literal("enabled")),
    rate: v.union(v.literal("MINUTE"), v.literal("HOUR")),
    companyId: v.id("companies"),
  }).index("companyId", ["companyId"]),

  orders: defineTable({
    paymentMethod: v.optional(
      v.union(v.literal("CASH"), v.literal("DEBIT"), v.literal("CREDIT")),
    ),
    statusPayment: v.union(
      v.literal("OPEN"),
      v.literal("PENDING"),
      v.literal("PAID"),
      v.literal("CANCELLED"), // new enum
      v.literal("ARCHIVE"),
    ),
    // isBooking: v.boolean(),
    // Todos: totalAmount, revenue, tax, disc, note, dueDate, should be on Model Payments (note: createdBy has both in Model Orders & Payments)
    totalAmount: v.optional(v.float64()),
    revenue: v.optional(v.float64()),
    tax: v.optional(v.float64()),
    discount: v.optional(v.float64()),
    note: v.optional(v.string()),
    customerId: v.optional(v.id("customers")),
    dueDate: v.optional(v.float64()), // new field
    createdBy: v.id("users"),
    updatedBy: v.optional(v.id("users")),
    companyId: v.id("companies"),
  })
    .index("customerId", ["customerId"])
    .index("createdBy", ["createdBy"])
    .index("updatedBy", ["updatedBy"])
    .index("companyId", ["companyId"]),

  // poolRentals is similar to orderlines
  poolRentals: defineTable({
    description: v.optional(v.string()),
    timeStart: v.float64(), // required
    timeEnd: v.union(v.float64(), v.null()), // not required
    duration: v.optional(v.number()),
    totalCost: v.optional(v.float64()),
    isBooking: v.boolean(),
    poolTableId: v.id("poolTables"),
    packetId: v.id("packets"),
    orderId: v.id("orders"),
  })
    .index("packetId", ["packetId"])
    .index("poolTableId", ["poolTableId"])
    .index("orderId", ["orderId"]),

  products: defineTable({
    name: v.string(),
    costPrice: v.float64(),
    salePrice: v.float64(),
    status: v.union(v.literal("disabled"), v.literal("enabled")),
    countInStock: v.optional(v.float64()), // Todos: next feature: create Model Invetories
    unitOfMeasureId: v.id("unitOfMeasures"),
    categoryId: v.id("categories"),
    companyId: v.id("companies"),
  })
    .index("unitOfMeasureId", ["unitOfMeasureId"])
    .index("categoryId", ["categoryId"])
    .index("companyId", ["companyId"]),

  orderlines: defineTable({
    description: v.optional(v.string()),
    orderlineStatus: v.union(v.literal("UNORDERED"), v.literal("ORDERED")),
    quantity: v.number(),
    amount: v.float64(),
    isFree: v.boolean(),
    productId: v.id("products"),
    orderId: v.id("orders"),
  })
    .index("productId", ["productId"])
    .index("orderId", ["orderId"]),

  categories: defineTable({
    name: v.string(),
    description: v.string(), // required b'coz it's global model
  }).index("by_name", ["name"]),

  // Todos: set the fields to default and global as like as Categories
  unitOfMeasures: defineTable({
    name: v.string(),
    description: v.string(), // required b'coz it's global model
    // companyId: v.id("companies"),
  }).index("by_name", ["name"]),

  memberships: defineTable({
    level: v.string(),
    discountRate: v.float64(),
    customerId: v.optional(v.id("customers")), // Todos: not required (yet) b'coz have not config the Membership's feature
  }).index("customerId", ["customerId"]),
})
