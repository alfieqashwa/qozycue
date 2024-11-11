/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as companies from "../companies.js";
import type * as customers from "../customers.js";
import type * as discounts from "../discounts.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as orders from "../orders.js";
import type * as packets from "../packets.js";
import type * as pooltables from "../pooltables.js";
import type * as products from "../products.js";
import type * as sessions from "../sessions.js";
import type * as taxes from "../taxes.js";
import type * as unitofmeasures from "../unitofmeasures.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  categories: typeof categories;
  companies: typeof companies;
  customers: typeof customers;
  discounts: typeof discounts;
  helpers: typeof helpers;
  http: typeof http;
  messages: typeof messages;
  orders: typeof orders;
  packets: typeof packets;
  pooltables: typeof pooltables;
  products: typeof products;
  sessions: typeof sessions;
  taxes: typeof taxes;
  unitofmeasures: typeof unitofmeasures;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
