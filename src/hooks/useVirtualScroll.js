import { useRef, useState, useCallback, useEffect } from "react";

/**
 * useVirtualScroll — Lightweight virtual scrolling for large lists
 *
 * Returns: { containerRef, visibleRange }
 * - containerRef: attach to scrollable container
 * - visibleRange: { start, end } indices of visible items
 *
 * Usage:
 *   const { containerRef, visibleRange } = useVirtualScroll(items.length, itemHeight);
 *   const visibleItems = items.slice(visibleRange.start, visibleRange.end);
 */
export function useVirtualScroll(itemCount, itemHeight, bufferSize = 5) {
  const containerRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
    const end = Math.min(itemCount, Math.ceil((scrollTop + clientHeight) / itemHeight) + bufferSize);

    setVisibleRange({ start, end });
  }, [itemCount, itemHeight, bufferSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    // Initial calculation
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    visibleRange,
    totalHeight: itemCount * itemHeight,
  };
}
