import { db } from "./drizzle"
import { eq } from "drizzle-orm"
import { users } from "./schema"
import { auth } from "@/auth"

export async function getUser() {
  const session = await auth()

  if (!session?.user?.id) return null

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1)

  return user[0]
}
