import { eq } from "drizzle-orm"
import { validatedAction } from "@/lib/auth/middleware"
import { signUpSchema } from "./schemas"
import { db } from "@/db/drizzle"
import { NewUser, users } from "@/db/schema"
import { hashPassword } from "@/lib/auth/session"

export const signUp = validatedAction(signUpSchema, async (data) => {
  const { email, password, name } = data

  const errorResponse = {
    error: "Failed to create user. Please try again.",
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (existingUser.length > 0) {
    return errorResponse
  }

  const passwordHash = await hashPassword(password)

  const newUser: NewUser = {
    email,
    password: passwordHash,
    name,
  }

  const [createdUser] = await db.insert(users).values(newUser).returning()

  if (!createdUser) {
    return errorResponse
  }

  return {
    error: false,
    user: createdUser,
  }
})
