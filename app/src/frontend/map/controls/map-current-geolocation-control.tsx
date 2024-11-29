import React, { useCallback, LegacyRef } from 'react';
import { useMap } from 'react-leaflet';

import { disableLeafletClickPropagation } from '../map-utils'

export const MapCurrentGeoLocationControl = () => {
    const map = useMap();
    // const controlRef = useCallback<HTMLButtonElement| null>(disableLeafletClickPropagation, []);
    // const controlRef = useCallback<LegacyRef<HTMLButtonElement> | null>(disableLeafletClickPropagation, []);
    // const controlRef = useCallback(disableLeafletClickPropagation, []);
    //const controlRef = useCallback((e: HTMLElement) => disableLeafletClickPropagation(e, map.DomEvent.disableClickPropagation), []);
    const controlRef = useCallback((e: HTMLElement) => e, []);

    const handleClick = () => {
        map.locate().on("locationfound", function (e) {
            console.log(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        });
    }

    return <div className="leaflet-control-container">
            <div className="leaflet-top leaflet-right">
                <button ref={controlRef} className="btn-geolocation leaflet-control" onClick={handleClick}>
                    <img className="btn-geolocation-icon" src="/images/map-marker-alt-solid.svg" alt="Markersymbol, gehe zu aktueller Position"></img>
                </button>
            </div>
        </div>
}
