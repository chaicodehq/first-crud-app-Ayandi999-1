/**
 * TODO: Handle 404 errors
 *
 * Return 404: { error: { message: "Route not found" } }
 */
export function notFound(_, res) {
  return res.status(404).json({ error: { message: `Route not Found` } });
}
