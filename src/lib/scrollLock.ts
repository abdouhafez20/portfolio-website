// Simple ref-counted body scroll lock utilities.
// Preserves the previous `document.body.style.overflow` value and
// restores it only when the last lock is released.

let lockCount = 0;
let prevOverflow: string | null = null;

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount === 0) {
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (lockCount <= 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    document.body.style.overflow = prevOverflow ?? '';
    prevOverflow = null;
  }
}

export function isBodyScrollLocked() {
  return lockCount > 0;
}
