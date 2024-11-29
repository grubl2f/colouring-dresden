import { useState, useEffect, useRef, useCallback } from 'react';

export const useDragResize = (element: HTMLElement, onResize: (dx: number, dy: number) => void, threshold = 5) => {
    const isDragging = useRef(false);
    const startY = useRef(0);
    const onMouseDown = useCallback((e) => {
        console.debug("useDragResize: onMouseDown:", {isDragging: isDragging.current, startY: startY.current})
        startY.current = e.clientY || e.touches[0].clientY || 0;
        isDragging.current = false;
        e.target.setPointerCapture(e.pointerId);
        element.addEventListener('pointermove', onMouseMove);
        element.addEventListener('pointerup', onEnd);
    }, [
        element,
    ]);

    const onMouseMove = useCallback((e) => {
        console.debug("useDragResize: onMouseMove:", {isDragging: isDragging.current, startY: startY.current})
        const currentY = e.clientY || e.touches[0].clientY || 0;
        const dY = currentY - startY.current;
        if (!isDragging.current && Math.abs(dY) > threshold) {
            isDragging.current = true;
        }

        if (isDragging.current) {
            onResize(0, dY);
            startY.current = currentY; 
        }
    }, [
        onResize,
        onMouseDown,
    ]);

    const onEnd = useCallback((e) => {
        console.debug("useDragResize: onEnd:", {isDragging: isDragging.current, startY: startY.current})
        e.target.releasePointerCapture(e.pointerId);
        element.removeEventListener('pointermove', onMouseMove);
        element.removeEventListener('pointerup', onEnd);
        document.body.classList.add('disable-interactions');
        setTimeout(() => {
            document.body.classList.remove('disable-interactions');
        }, 600);
        e.preventDefault();
        // e.stopPropagation();
    }, [
        onMouseMove,
        element,
    ]);

    return { onMouseDown }
}
