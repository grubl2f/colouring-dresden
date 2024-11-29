import React, { useEffect, useCallback, useState, useImperativeHandle, forwardRef, LegacyRef } from 'react';
import { useMap } from 'react-leaflet';

import { disableLeafletClickPropagation } from '../map-utils'

import { useViewSize } from '../../hooks/use-view-size'

import { LegendIcon } from '../../components/icons';

// export interface MapLegendControlRef {
//     isVisible: () => boolean;
//     toggleControl: () => void;
// }

// export const MapLegendControl = forwardRef<MapLegendControlRef>((props, ref) => {
//     const map = useMap();
//     // const controlRef = useCallback<LegacyRef<HTMLButtonElement> | null>(disableLeafletClickPropagation, []);
//     const controlRef = useCallback(disableLeafletClickPropagation, []);
//     const {isMobileWidth, wasMobileWidth } = useScreenSize()
//     const [isVisible, setIsVisibleControl] = useState<boolean>(!isMobileWidth);

//     const toggleControl = () => {
//         console.debug("MapLegendControl: toggleControl: ", {isVisible})
//         setIsVisibleControl(prev => !prev);
//     }

//     useEffect(() => {
//         if (!isMobileWidth) {
//             setIsVisibleControl(true)
//         } else {
//             if (!wasMobileWidth) {
//                 setIsVisibleControl(false)
//             }
//         }
//     }, [
//         isMobileWidth,
//         wasMobileWidth,
//     ])

//     // useEffect(() => {
//     //     if (ref) {
//     //         if (typeof ref === 'function') {
//     //             ref(controlRef.current);
//     //         } else if (ref.current !== undefined) {
//     //             ref.current = controlRef.current;
//     //         }
//     //     }
//     // }, [ref])

//     useImperativeHandle(ref, () => ({
//         isVisible: () => isVisible,
//         // isVisible: () => true,
//         // isVisible: () => {
//         //     console.debug("MapLegendControl: useImperativeHandle: isVisible: ", {isVisible})
//         //     return isVisible
//         // },
//         toggleControl
//     }), [isVisible])


//     useEffect(() => {
//         console.debug("MapLegendControl: useEffect: isVisible: ", {isVisible});
//     }, [isVisible])

//     return  <>
//             <div className="leaflet-control-container">
//                 <div className="leaflet-bottom leaflet-right">
//                     <button ref={controlRef} className="leaflet-control leaflet-bar toggle-legend" onClick={toggleControl} title="Kartenlegende anzeigen">
//                         <LegendIcon />
//                     </button>
//                 </div>
//             </div>
//         </>
// })

export const MapLegendControl = ({setVisibility}) => {
    const map = useMap();
    // const controlRef = useCallback<LegacyRef<HTMLButtonElement> | null>(disableLeafletClickPropagation, []);
    //const controlRef = useCallback(disableLeafletClickPropagation, []);
    // const controlRef = useCallback((e: HTMLElement) => disableLeafletClickPropagation(e, map.DomEvent.disableClickPropagation), []);
    const controlRef = useCallback((e: HTMLElement) => e, []);
    const {isMobileWidth, wasMobileWidth } = useViewSize()
    // const [isVisible, setIsVisibleControl] = useState<boolean>(!isMobileWidth);

    const toggleControl = () => {
        setVisibility(prev => !prev);
    }

    useEffect(() => {
        if (!isMobileWidth) {
            setVisibility(true)
        } else {
            if (!wasMobileWidth) {
                setVisibility(false)
            }
        }
    }, [
        isMobileWidth,
        wasMobileWidth,
    ])

    // useEffect(() => {
    //     if (ref) {
    //         if (typeof ref === 'function') {
    //             ref(controlRef.current);
    //         } else if (ref.current !== undefined) {
    //             ref.current = controlRef.current;
    //         }
    //     }
    // }, [ref])

    // useImperativeHandle(ref, () => ({
    //     isVisible: () => isVisible,
    //     // isVisible: () => true,
    //     // isVisible: () => {
    //     //     console.debug("MapLegendControl: useImperativeHandle: isVisible: ", {isVisible})
    //     //     return isVisible
    //     // },
    //     toggleControl
    // }), [isVisible])


    // useEffect(() => {
    //     console.debug("MapLegendControl: useEffect: isVisible: ", {isVisible});
    // }, [isVisible])

    return  <>
            <div className="leaflet-control-container">
                <div className="leaflet-bottom leaflet-right">
                    <button ref={controlRef} className="leaflet-control leaflet-bar toggle-legend" onClick={toggleControl} title="Kartenlegende anzeigen">
                        <LegendIcon />
                    </button>
                </div>
            </div>
        </>
}
