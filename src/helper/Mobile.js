export function isMobile() {
  const userAgent = navigator.userAgent;
  return /iPad|iPhone|iPod|android/.test(userAgent) || 'ontouchend' in document;
}
