export function encodeId(id: string) {
  if (!id) return "";
  try {
    // Standard Base64
    const b64 = btoa(id);
    // Convert to URL-safe Base64
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    return id;
  }
}

export function decodeId(encodedId: string) {
  if (!encodedId) return "";
  try {
    // Ensure we handle URL encoded input
    let str = decodeURIComponent(encodedId);
    // Convert back from URL-safe Base64
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if missing
    while (str.length % 4) {
      str += '=';
    }
    return atob(str);
  } catch (e) {
    return encodedId;
  }
}
