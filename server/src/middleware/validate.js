// Wraps a zod schema into middleware that validates req.body.
// On success, replaces req.body with the parsed/transformed value.
export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(422).json({
        error: {
          message: 'Validation failed',
          details: result.error.flatten(),
        },
      })
    }
    req.body = result.data
    next()
  }
}
