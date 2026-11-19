export function getJwtExpiration(token: string): number | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return typeof payload.exp === "number" && Number.isFinite(payload.exp)
      ? payload.exp
      : null;
  } catch {
    return null;
  }
}
// Expiration is a scheduling hint only. The backend always validates the token.
export function shouldRefreshJwtToken(token: string) {
  const exp = getJwtExpiration(token);
  return exp !== null && exp <= Date.now() / 1000 + 10;
}
