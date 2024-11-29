import React, { useEffect, useCallback, useState, LegacyRef, useRef } from 'react';
import { useMap, AttributionControl } from 'react-leaflet';

import { disableLeafletClickPropagation } from '../map-utils'
import { useViewSize } from '../../hooks/use-view-size'

import { CopyrightIcon } from '../../components/icons';

export const MapAttributionControl = ({ }) => {
    const map = useMap();
    // const controlRef = useCallback<HTMLButtonElement | null>(disableLeafletClickPropagation, []);
    // const controlRef = useCallback<LegacyRef<HTMLButtonElement> | null>(disableLeafletClickPropagation, []);
    // const controlRef = useCallback((e: HTMLElement) => disableLeafletClickPropagation(e, map.DomEvent.disableClickPropagation), []);
    const controlRef = useCallback((e: HTMLElement) => e, []);
    // const controlRef = useRef<HTMLButtonElement | null>(null);
    const {isMobileWidth, wasMobileWidth } = useViewSize()
    const [isVisible, setIsVisibleControl] = useState<boolean>(!isMobileWidth);

    const toggleControl = () => {
        setIsVisibleControl(prev => !prev);
    }

    // useEffect(() => {
    //     disableLeafletClickPropagation(controlRef.current)
    // }, [])

    useEffect(() => {
        if (!isMobileWidth) {
            setIsVisibleControl(true)
        } else {
            if (!wasMobileWidth) {
                setIsVisibleControl(false)
            }
        }
    }, [
        isMobileWidth,
        wasMobileWidth,
    ])

    return  <>
            {isVisible ? <AttributionControl prefix=""/> : <></>}
            <div className="leaflet-control-container">
                <div className="leaflet-bottom leaflet-left">
                    <button ref={controlRef} className="leaflet-control leaflet-bar toggle-attribution" onClick={toggleControl} title="Quellen und Mitwirkende anzeigen">
                        <CopyrightIcon />
                    </button>
                </div>
            </div>
        </>
}
