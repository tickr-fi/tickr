/**
 * Prevents event propagation and default behavior
 * Includes Safari iOS fix for native events
 */
export function preventEventPropagation(e: React.MouseEvent | React.TouchEvent): void {
  e.preventDefault();
  e.stopPropagation();
  
  // Additional Safari iOS fix
  if (e.nativeEvent) {
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
  }
}
