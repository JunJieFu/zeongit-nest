export const getEnvPaths = () => {
  const NODE_ENV = (process.env.NODE_ENV + "").trim()
  if (NODE_ENV === "development") {
    return [".env", ".env.development"]
  } else if (NODE_ENV === "production") {
    return [".env", ".env.development"]
  } else {
    return [".env"]
  }
}
