function fail(res, zodError) {
  res.status(422).json({
    error: {
      message: 'Validation failed',
      details: zodError.flatten(),
    },
  })
}

// Wraps a zod schema into middleware that validates req.body.
// On success, replaces req.body with the parsed/transformed value.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) return fail(res, result.error)
    req.body = result.data
    next()
  }
}

// Validates req.query and replaces req.query with the parsed value. Query
// fields are also mirrored onto req.body so GET handlers can read uniformly.
export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) return fail(res, result.error)
    req.query = result.data
    req.body = { ...req.body, ...result.data }
    next()
  }
}
