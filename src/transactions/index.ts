import { z } from "zod"

export const getTransactionSchema = () =>
  z.object({
    id: z.string(),
  })

export const getTransactionResponseSchema = () =>
  z.object({
    transaction: z.object({
      id: z.string(),
      hash: z.string().nullable(),
      name: z.string(),
      smartContractVersionId: z.string().nullable(),
      walletId: z.string().nullable(),
      poolId: z.string().nullable(),
      from: z.string(),
      to: z.string(),
      rpcUrl: z.string(),
      method: z.string(),
      methodParams: z.unknown(),
      transactionParams: z.unknown(),
      executionStartDate: z.coerce.date(),
      executionEndDate: z.coerce.date().nullable(),
      result: z.unknown().nullable(),
      status: z.enum(["SUCCESS", "PENDING", "FAILED"]),
      error: z.unknown().nullable(),
    }),
  })

export const tagRegex = /^[a-zA-Z0-9_]+$/
export const cuidRegex = /^[a-z0-9]+$/
export const transactionParams = z
  .object({
    value: z.string().optional(),
  })
  .optional()

export const callContractMethodSchema = () =>
  z.object({
    smartContractId: z.string().regex(cuidRegex),
    version: z.number().optional(), // latest by default
    method: z.string(),
    methodParams: z.array(z.unknown()).optional(),
    transactionParams: transactionParams.optional(),
    poolId: z.string().regex(cuidRegex),
    encryptionKey: z.string(),
    customSort: z
      .object({
        smartContractId: z.string().regex(cuidRegex),
        version: z.number().optional(), // latest by default
        method: z.string(),
        methodParams: z.array(z.unknown()).optional(),
        resultKind: z.enum(["boolean", "number"]),
        direction: z.enum(["asc", "desc"]),
      })
      .optional(),
  })

const callContractMethodResponseBaseSchema = () =>
  z.object({
    meta: z.object({
      transactionId: z.string(),
      from: z.string(),
      to: z.string(),
      rpc: z.string(),
      method: z.string(),
      methodParams: z.array(z.unknown()),
      transactionParams,
      executionTime: z.number(),
      executionStart: z.number(),
      executionEnd: z.number(),
    }),
  })

const callContractMethodResponsePendingSchema = () =>
  callContractMethodResponseBaseSchema().merge(
    z.object({
      result: z.unknown(),
      status: z.literal("pending"),
    })
  )

const callContractMethodResponseSuccessSchema = () =>
  callContractMethodResponseBaseSchema().merge(
    z.object({
      result: z.unknown(),
      status: z.literal("success"),
    })
  )

const callContractMethodResponseErrorSchema = () =>
  callContractMethodResponseBaseSchema().merge(
    z.object({
      error: z.object({
        message: z.string(),
        original: z.unknown(),
      }),
      status: z.literal("error"),
    })
  )

export const callContractMethodResponseSchema = () =>
  z.union([
    callContractMethodResponseSuccessSchema(),
    callContractMethodResponseErrorSchema(),
    callContractMethodResponsePendingSchema(),
  ])
