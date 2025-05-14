## ESP-32 Implementation

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";
const char\* apiEndpoint = "https://outgoing-crow-589.convex.site/api/pooltables/k5786ghkqqe1505grf0g674a1578sjgf";

void setup() {
Serial.begin(115200);
WiFi.begin(ssid, password);

while (WiFi.status() != WL_CONNECTED) {
delay(1000);
Serial.println("Connecting to WiFi...");
}
Serial.println("Connected to WiFi");
}

void loop() {
if (WiFi.status() == WL_CONNECTED) {
HTTPClient http;
http.begin(apiEndpoint);

    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();

      // Parse JSON response
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      // Access your data
      bool isActive = doc["isActive"];
      Serial.print("Pool table is active: ");
      Serial.println(isActive);
    }

    http.end();

}

// Poll every 5 seconds
delay(5000);
}

---

Based on your schema, if you want to delete a company and clean up related data, you should delete records from all tables that have a reference to the company via a companyId field.

According to your schema, these tables are:

- users - has an optional companyId field
- taxes - has a required companyId field
- discounts - has a required companyId field
- customers - has a required companyId field
- poolTables - has a required companyId field
- packets - has a required companyId field
- orders - has a required companyId field
- products - has a required companyId field

Additionally, you should consider cascading deletions to tables that reference these tables:

- poolRentals - references poolTables, packets, and orders
- orderlines - references products and orders

This approach ensures that you don't have orphaned records that reference data that no longer exists.

```typescript
export const remove = mutation({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    await superAdminProcedure(ctx)

    // First, delete records from tables that don't have dependencies
    // Delete taxes related to this company
    const taxes = await ctx.db
      .query("taxes")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const tax of taxes) {
      await ctx.db.delete(tax._id)
    }

    // Delete discounts related to this company
    const discounts = await ctx.db
      .query("discounts")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const discount of discounts) {
      await ctx.db.delete(discount._id)
    }

    // Delete products and their orderlines
    const products = await ctx.db
      .query("products")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const product of products) {
      // Delete orderlines for this product
      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("productId", (q) => q.eq("productId", product._id))
        .collect()
      for (const orderline of orderlines) {
        await ctx.db.delete(orderline._id)
      }
      await ctx.db.delete(product._id)
    }

    // Delete poolTables, packets, and their poolRentals
    const poolTables = await ctx.db
      .query("poolTables")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const poolTable of poolTables) {
      // Delete poolRentals for this poolTable
      const poolRentals = await ctx.db
        .query("poolRentals")
        .withIndex("poolTableId", (q) => q.eq("poolTableId", poolTable._id))
        .collect()
      for (const poolRental of poolRentals) {
        await ctx.db.delete(poolRental._id)
      }
      await ctx.db.delete(poolTable._id)
    }

    const packets = await ctx.db
      .query("packets")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const packet of packets) {
      // Delete poolRentals for this packet
      const poolRentals = await ctx.db
        .query("poolRentals")
        .withIndex("packetId", (q) => q.eq("packetId", packet._id))
        .collect()
      for (const poolRental of poolRentals) {
        await ctx.db.delete(poolRental._id)
      }
      await ctx.db.delete(packet._id)
    }

    // Delete orders and their related records
    const orders = await ctx.db
      .query("orders")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const order of orders) {
      // Delete orderlines for this order
      const orderlines = await ctx.db
        .query("orderlines")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()
      for (const orderline of orderlines) {
        await ctx.db.delete(orderline._id)
      }

      // Delete poolRentals for this order
      const poolRentals = await ctx.db
        .query("poolRentals")
        .withIndex("orderId", (q) => q.eq("orderId", order._id))
        .collect()
      for (const poolRental of poolRentals) {
        await ctx.db.delete(poolRental._id)
      }

      await ctx.db.delete(order._id)
    }

    // Delete customers and their memberships
    const customers = await ctx.db
      .query("customers")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const customer of customers) {
      // Delete memberships for this customer
      const memberships = await ctx.db
        .query("memberships")
        .withIndex("customerId", (q) => q.eq("customerId", customer._id))
        .collect()
      for (const membership of memberships) {
        await ctx.db.delete(membership._id)
      }
      await ctx.db.delete(customer._id)
    }

    // Update users (since companyId is optional)
    const users = await ctx.db
      .query("users")
      .withIndex("companyId", (q) => q.eq("companyId", args.id))
      .collect()
    for (const user of users) {
      await ctx.db.patch(user._id, { companyId: undefined })
    }

    // Finally, delete the company
    return await ctx.db.delete(args.id)
  },
})
```
