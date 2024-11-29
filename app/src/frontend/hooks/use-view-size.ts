import { useState, useEffect } from 'react';

type ViewSize = {
    width: number | undefined;
    height: number | undefined;
    // isMobileWidth: boolean | undefined;
    isMobileWidth: boolean;
    wasMobileWidth: boolean;
}

const checkIsMobileWidth = (w: number): boolean => {
    if (typeof window === 'undefined') {
      console.debug("checkIsMobileWidth: missing window");
      return false;
    }

    return window?.innerWidth < 735;
}

export const useViewSize = (debounceDelay = 50): ViewSize => {
    const [viewSize, setViewSize] = useState<ViewSize>({
        width: globalThis?.window?.innerWidth,
        height: globalThis?.window?.innerHeight,
        isMobileWidth: checkIsMobileWidth(globalThis?.window?.innerWidth),
        wasMobileWidth: false,
    });

/*
    const [viewSize, setViewSize] = useState<ViewSize>({
        width: 0,
        height: 0,
        isMobileWidth: false,
        wasMobileWidth: false,
    });
*/

//    useEffect(() => {
//        //if (typeof window === 'undefined' || typeof globalThis === 'undefined' || !globalThis?.window) {
//        if (typeof globalThis === 'undefined' || !globalThis?.window) {
//          return;
//        }
//        console.debug("useViewSize: useEffect: window size changed:", [window?.innerWidth, window?.innerHeight], window);
//    }, [
//        window?.innerWidth,
//        window?.innerHeight,
//    ]);
    useEffect(() => {
        //if (typeof window === 'undefined' || typeof globalThis === 'undefined' || !globalThis?.window) {
        if (typeof globalThis === 'undefined' || !globalThis?.window) {
        //if (typeof window === 'undefined') return;
          console.debug("useViewSize: useEffect: missing window");
          return;
        }

        let timeoutId: ReturnType<typeof setTimeout>;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() =>{
                console.debug("useViewize: useEffect: debounced:", {
                    isMobileWidth: checkIsMobileWidth(window?.innerWidth),
                    wasMobileWidth: viewSize.isMobileWidth,
                })
                setViewSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                    isMobileWidth: checkIsMobileWidth(window?.innerWidth),
                    wasMobileWidth: viewSize.isMobileWidth,
                });
            }, debounceDelay);
        }
        handleResize()
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, [debounceDelay]);

    return viewSize;
}
