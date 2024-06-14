import { z } from "zod"

export const generateExampleKeyResponseSchema = () =>
  z.object({
    id: z.string(),
    secret: z.string(),
  })
