import Google from "@auth/core/providers/google"
import { convexAuth } from "@convex-dev/auth/server"
import { MutationCtx } from "./_generated/server"
import { findUserByEmail } from "./helpers"

//? Source -> https://labs.convex.dev/auth/advanced#controlling-user-creation-and-account-linking-behavior
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    // `args.type` is one of "oauth" | "email" | "phone" | "credentials" | "verification"
    // `args.provider` is the currently used provider config
    async createOrUpdateUser(ctx: MutationCtx, args) {
      // console.log(`existingUserId::: `, args.existingUserId)

      if (args.existingUserId) {
        // Optionally merge updated fields into the existing user object here
        const existingUser = await findUserByEmail(ctx, args.profile.email)

        if (existingUser) {
          if (
            existingUser.name === undefined &&
            existingUser.image === undefined
          ) {
            await ctx.db.patch(existingUser._id, {
              ...args.profile,
              name: args.profile.name as string,
              image: args.profile.image as string,
            })
          }

          return existingUser._id
        }

        return args.existingUserId
      }

      // console.log({ existingUser })

      // Implement your own user creation:
      const isDewa = args.profile.email === process.env.DEWA_EMAIL!
      return await ctx.db.insert("users", {
        ...args.profile,
        role: isDewa ? "DEWA" : "USER",
      })
    },
  },
})
