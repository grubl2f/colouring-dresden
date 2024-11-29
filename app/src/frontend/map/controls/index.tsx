import React, { useEffect, forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
// import { useMap, ZoomControl } from 'react-leaflet';
import { ZoomControl } from 'react-leaflet';
// import L from 'leaflet';
// import ReactDom from 'react-dom';

import { MapCurrentGeoLocationControl } from './map-current-geolocation-control'
import { MapAttributionControl } from './map-attribution-control'
// import { MapLegendControl, MapLegendControlRef } from './map-legend-control'
import { MapLegendControl } from './map-legend-control'

// export interface MapControlsRef {
//   isLegendVisible: () => boolean;
//   toggleLegendControl: () => void;
// }

// export const MapControls = forwardRef<MapControlsRef>((props, ref) => {
//   const map = useMap();
//   const toggleLegendButtonRef = useRef<MapLegendControlRef | null>(null);

//   // useEffect(() => {
//   // })

//   useImperativeHandle(ref, () => ({
//     // legend: {
//       // isLegendVisible: () => toggleLegendButtonRef.current?.isVisible(),
//       isLegendVisible: () => {
//         console.debug("MapControls: useImperativeHandle: isLegendVisible: ", { toggleLegendButtonRef });
//         return toggleLegendButtonRef.current?.isVisible();
//       },
//       // isLegendVisible: () => {
//       //   console.debug("MapControls: useImperativeHandle: isLegendVisible: ", {toggleLegendButtonRef: toggleLegendButtonRef.current, isLegendVisible: toggleLegendButtonRef.current?.isVisible()})
//       //   return toggleLegendButtonRef.current?.isVisible()
//       // },
//       // toggleLegendControl: () => toggleLegendButtonRef.current?.toggleControl(),
//       toggleLegendControl: () => {
//         console.debug("MapControls: useImperativeHandle: toggleLegendControl: ", { toggleLegendButtonRef });
//       },
//     // }
//   }))


//   return <>
//     <ZoomControl position="topright" />
//     <MapCurrentGeoLocationControl />
//     <MapAttributionControl />
//     <MapLegendControl ref={toggleLegendButtonRef} />
//   </>;
// })

export const MapControls = ({setLegendVisibility}) => {
  // const map = useMap();
  // const toggleLegendButtonRef = useRef<MapLegendControlRef | null>(null);

  // useEffect(() => {
  // })

  // useImperativeHandle(ref, () => ({
  //   // legend: {
  //     // isLegendVisible: () => toggleLegendButtonRef.current?.isVisible(),
  //     isLegendVisible: () => {
  //       console.debug("MapControls: useImperativeHandle: isLegendVisible: ", { toggleLegendButtonRef });
  //       return toggleLegendButtonRef.current?.isVisible();
  //     },
  //     // isLegendVisible: () => {
  //     //   console.debug("MapControls: useImperativeHandle: isLegendVisible: ", {toggleLegendButtonRef: toggleLegendButtonRef.current, isLegendVisible: toggleLegendButtonRef.current?.isVisible()})
  //     //   return toggleLegendButtonRef.current?.isVisible()
  //     // },
  //     // toggleLegendControl: () => toggleLegendButtonRef.current?.toggleControl(),
  //     toggleLegendControl: () => {
  //       console.debug("MapControls: useImperativeHandle: toggleLegendControl: ", { toggleLegendButtonRef });
  //     },
  //   // }
  // }))


  return <>
    <ZoomControl position="topright" />
    <MapCurrentGeoLocationControl />
    <MapAttributionControl />
    <MapLegendControl setVisibility={setLegendVisibility} />
  </>;
}