import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useRef, useImperativeHandle, forwardRef } from 'react';
// import { AttributionControl, MapContainer, ZoomControl, useMapEvent, Pane, useMap } from 'react-leaflet';
import { MapContainer, useMapEvent, ZoomControl, Pane, useMap } from 'react-leaflet';

//import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { useViewSize } from '../hooks/use-view-size'
// import { MapControls, MapControlsRef } from './controls'
import { MapControls } from './controls'
// import { MapCurrentGeoLocationControl } from './controls/map-current-geolocation-control';
// import { MapAttributionControl } from './controls/map-attribution-control';
// import { MapLegendControl, MapLegendControlRef } from './controls/map-legend-control';
// import { MapLegendControl } from './controls/map-legend-control';
// import { disableLeafletClickPropagation } from './map-utils';


import { apiGet } from '../apiHelpers';
import { initialMapViewport, mapBackgroundColor, MapTheme, LayerEnablementState } from '../config/map-config';

import { Building } from '../models/building';

import { CityBaseMapLayer } from './layers/city-base-map-layer';
import { CityBoundaryLayer } from './layers/city-boundary-layer';
import { BoroughBoundaryLayer } from './layers/borough-boundary-layer';
import { BoroughLabelLayer } from './layers/borough-label-layer';
import { ParcelBoundaryLayer } from './layers/parcel-boundary-layer';
import { HistoricDataLayer } from './layers/historic-data-layer';
import { FloodBoundaryLayer } from './layers/flood-boundary-layer';
import { ConservationAreaBoundaryLayer } from './layers/conservation-boundary-layer';
import { VistaBoundaryLayer } from './layers/vista-boundary-layer';
import { HousingBoundaryLayer } from './layers/housing-boundary-layer';
import { CreativeBoundaryLayer } from './layers/creative-boundary-layer';
import { BuildingBaseLayer } from './layers/building-base-layer';
import { BuildingDataLayer } from './layers/building-data-layer';
import { BuildingNumbersLayer } from './layers/building-numbers-layer';
import { BuildingHighlightLayer } from './layers/building-highlight-layer';

import { Historic_1880_DataLayer } from './layers/historic-1880-data-layer';
import { Historic_1911_DataLayer } from './layers/historic-1911-data-layer';
import { Historic_1945_DataLayer } from './layers/historic-1945-data-layer';

import { Legend } from './legend';
import SearchBox from './search-box';
import ThemeSwitcher from './theme-switcher';
import DataLayerSwitcher from './data-switcher';
import { BoroughSwitcher } from './borough-switcher';
import { ParcelSwitcher } from './parcel-switcher';
import { FloodSwitcher } from './flood-switcher';
import { ConservationAreaSwitcher } from './conservation-switcher';
import { HistoricDataSwitcher } from './historic-data-switcher';
import { VistaSwitcher } from './vista-switcher';
import { CreativeSwitcher } from './creative-switcher';
import { HousingSwitcher } from './housing-switcher';
import { BuildingMapTileset } from '../config/tileserver-config';
import { useDisplayPreferences } from '../displayPreferences-context';
import { CategoryMapDefinition } from '../config/category-maps-config';

import { Historic_1880_DataSwitcher } from './historic-1880-data-switcher';
import { Historic_1911_DataSwitcher } from './historic-1911-data-switcher';
import { Historic_1945_DataSwitcher } from './historic-1945-data-switcher';

// import { CopyrightIcon, LegendIcon } from '../components/icons';

/* import Geolocation_Button from './geolocation'; */

interface ColouringMapProps {
    selectedBuildingId: number;
    mode: 'basic' | 'view' | 'edit' | 'multi-edit';
    revisionId: string;
    onBuildingAction: (building: Building) => void;
    mapColourScale: BuildingMapTileset;
    onMapColourScale: (x: BuildingMapTileset) => void;
    categoryMapDefinitions: CategoryMapDefinition[],
    building?: Building,
}

// const checkIsWideScreen = (w: number) => {
//     return w > 734
// }
// const showAttributionAlways = checkIsWideScreen;
// const showLegendAlways = checkIsWideScreen;

export const ColouringMap : FC<ColouringMapProps> = ({
    mode,
    revisionId,
    onBuildingAction,
    selectedBuildingId,
    mapColourScale,
    onMapColourScale,
    categoryMapDefinitions,
    building,
    children
}) => {
    const {isMobileWidth, wasMobileWidth } = useViewSize()
    // if (isSsr) return null

    const { darkLightTheme, darkLightThemeSwitch, showLayerSelection } = useDisplayPreferences();
    const [position, setPosition] = useState(initialMapViewport.position);
    const [zoom, setZoom] = useState(initialMapViewport.zoom);
    // const [building, setBuilding] = useState<Building | null>(null);
    const [mapClickLatLng, setMapClickLatLng] = useState<{lat: number, lng: number} | null>(null);

    // const [showAttribution, setShowAttribution] = useState(showAttributionAlways(window?.innerWidth));
    // const [showAttribution, setShowAttribution] = useState(!isMobileWidth);

    // const toggleAttributionButtonRef = useRef<HTMLButtonElement | null>(null);
    // useEffect(() => {
    //     console.log("DEBUG: stop propagation", toggleAttributionButtonRef.current)
    //     if (toggleAttributionButtonRef.current) {
    //         L.DomEvent.disableClickPropagation(toggleAttributionButtonRef.current)
    //     }
    // }, [])
    // useEffect(() => {
    //     console.log("DEBUG: stop propagation", toggleAttributionButtonRef.current)
    //     if (toggleAttributionButtonRef.current) {
    //         L.DomEvent.disableClickPropagation(toggleAttributionButtonRef.current)
    //     }
    // }, [toggleAttributionButtonRef])

    // const [showLegend, setShowLegend] = useState(showLegendAlways(window?.innerWidth));
    const [showLegend, setShowLegend] = useState(!isMobileWidth);

    // const [isShowLegendAlways, setIsShowLegendAlways] = useState(showLegendAlways(window?.innerWidth));
    // const [isWideScreen, setIsWideScreen] = useState(false);

    // useEffect(() => {
    //     setShowAttribution(showAttributionAlways(window?.innerWidth || -1))
    //     setShowLegend(showLegendAlways(window?.innerWidth || -1))
    // }, [])
    // useEffect(() => {
    //     const _handleResize = () => {
    //         const wasWideScreen = isWideScreen
    //         const isWideScreenNow = checkIsWideScreen(window.innerWidth)
    //         setIsWideScreen(isWideScreenNow)
    //         if (isWideScreenNow) {
    //             setShowAttribution(true)
    //             setShowLegend(true)
    //         } else {
    //             if (wasWideScreen) {
    //                 setShowAttribution(false)
    //                 setShowLegend(false)
    //             }
    //         }
    //     }
    //     _handleResize()
    //     window.addEventListener('resize', _handleResize)
    //     return () => window.removeEventListener('resize', _handleResize)
    // }, [showAttribution, showLegend])

    // useEffect(() => {
    //     console.debug("ColouringMap: useEffect(resize): ", {
    //         isMobileWidth,
    //         wasMobileWidth,
    //     })
    //     if (!isMobileWidth) {
    //         // setShowAttribution(true)
    //         setShowLegend(true)
    //     } else {
    //         if (!wasMobileWidth) {
    //             // setShowAttribution(false)
    //             setShowLegend(false)
    //         }
    //     }
    // }, [
    //     isMobileWidth,
    //     wasMobileWidth,
    // ])

    // useEffect(() => {
    //     setIsShowLegendAlways(showLegendAlways(window?.innerWidth || -1))
    // }, [])
    // }, [window?.innerWidth])

    // const disableElementFromLeafletClickPropagation = (node: HTMLButtonElement | null) => {
    //     if (node !== null) {
    //         L.DomEvent.disableClickPropagation(node)
    //     }
    // }
    // const currentLocationButtonRef = useCallback(disableElementFromLeafletClickPropagation, []);
    // const toggleAttributionButtonRef = useCallback(disableElementFromLeafletClickPropagation, []);
    // const toggleLegendButtonRef = useCallback<HTMLButtonElement | null>(disableLeafletClickPropagation, []);
    // const toggleLegendButtonRef = useRef<typeof MapLegendControl | null>(null);
    // const toggleLegendButtonRef = useRef<MapLegendControlRef | null>(null);
    // const mapControlsRef = useCallback<MapControlsRef | null>(() => {}, []);
    // const mapControlsRef = useRef<MapControlsRef | null>(null);

    // useEffect(() => {
    //     console.debug("ColouringMap: useEffect: mapControlsRef: ", {mapControlsRef, toggleLegendButtonRef});
    // }, [])

    // const handleLocate = useCallback(
    //     (lat: number, lng: number, zoom: number) => {
    //         setPosition([lat, lng]);
    //         setZoom(zoom);
    //     },
    //     []
    // );

    const handleClick = useCallback(
        async (e) => {
            const {lat, lng} = e.latlng;
            const data = await apiGet(`/api/buildings/locate?lat=${lat}&lng=${lng}`);
            const _building = data?.[0] as Building;
            console.debug("Map: handleClick:", {building, lat, lng, e});
            // setBuilding(_building as Building|null);
            // setMapClickLatLng({lat, lng});
            // if (_building) {
            //     // setMapClickLatLng({lat: _building.location_latitude || lat, lng: _building?.location_longitude || lng});
            //     setMapClickLatLng({lat: _building.location_latitude, lng: _building.location_longitude});
            // }
            setMapClickLatLng({lat, lng});

            onBuildingAction(_building);
        },
        [onBuildingAction],
    )

    // const toggleLegend = (e) => {
    //     setShowLegend(prev => !prev);
    // }

    // const handleWindowResize = useCallback(event => {
    //     setShowAttribution(showAttributionAlways(window?.innerWidth || -1));
    // }, []);
    // useEffect(() => {
    //     window.addEventListener('resize', handleWindowResize);
    //     return () => {
    //         window.removeEventListener('resize', handleWindowResize);
    //     };
    // }, [handleWindowResize]);

    // const map = useMap();
    // useEffect(() => {
    //     // console.debug("Map: ResizeHandler: useEffect:", {mapSize: map.getSize(), options: map.options, container: map.getContainer()});
    //     const mapContainer = map.getContainer();
    //     const observer = new ResizeObserver(() => {
    //         // console.debug("Map: ResizeHandler: ResizeObserver:", {mapSize: map.getSize(), options: map.options, container: map.getContainer()});
    //         const center = map.getCenter();
    //         const newView = {lat: center.lat, lng: center.lng};
    //         if (
    //             typeof mapClickLatLng?.lat === 'number' &&
    //             typeof mapClickLatLng?.lng === 'number' &&
    //             !isNaN(mapClickLatLng.lat) &&
    //             !isNaN(mapClickLatLng.lng)
    //         ) {
    //             // map.invalidateSize();
    //             newView.lat = mapClickLatLng.lat
    //             newView.lng = mapClickLatLng.lng
    //             // map.setView([mapClickLatLng.lat, mapClickLatLng.lng], map.getZoom());
    //         } else {
    //             const mapBounds = map.getBounds();
    //             const containerHeight = mapContainer.offsetHeight;
    //             const _zoom = map.getZoom();
    //             const topLat = mapBounds.getNorth();
    //             const projectedTopLat = map.project([topLat, center.lng], _zoom);
    //             const newCenterPixelY = projectedTopLat.y + containerHeight / 2;
    //             const newCenter = map.unproject([projectedTopLat.x, newCenterPixelY], _zoom);
    //             newView.lat = newCenter.lat;
    //             // newView.lng = newCenter.lng;
    //             newView.lng = center.lng;
    //             // map.invalidateSize();
    //             // map.setView([newCenter.lat, center.lng], _zoom);
    //         }
    //         map.invalidateSize();
    //         map.setView([newView.lat, newView.lng], map.getZoom());
    //     });
    //     observer.observe(mapContainer);
    //     return () => {
    //         observer.unobserve(mapContainer);
    //     }
    // }, [
    //     map,
    //     // building?.lat,
    //     // building?.lng,
    //     mapClickLatLng?.lat,
    //     mapClickLatLng?.lng,
    // ])

    return (
        <div className="map-container">
            <MapContainer
                center={initialMapViewport.position}
                zoom={initialMapViewport.zoom}
                minZoom={9}
                maxZoom={18}
                doubleClickZoom={false}
                zoomControl={false}
                attributionControl={false}
                // trackResize={true}
            >
                <ClickHandler onClick={handleClick} />
                <ResizeHandler building={building} mapClickLatLng={mapClickLatLng}/>
                <MapBackgroundColor theme={darkLightTheme} />
                <MapViewport position={position} zoom={zoom} />

                <Pane
                    key={darkLightTheme}
                    name={'cc-base-pane'}
                    style={{zIndex: 50}}
                >
                    <CityBaseMapLayer theme={darkLightTheme} />
                    <BuildingBaseLayer theme={darkLightTheme} />
                </Pane>

                <Pane
                    name='cc-overlay-pane-shown-behind-buildings'
                    style={{zIndex: 199}}
                >
                    <ConservationAreaBoundaryLayer/>
                </Pane>

                {
                    mapColourScale &&
                        <BuildingDataLayer
                            tileset={mapColourScale}
                            revisionId={revisionId}
                        />
                }

                <Pane
                    name='cc-overlay-pane'
                    style={{zIndex: 300}}
                >
                    <CityBoundaryLayer/>
                    <HistoricDataLayer/>
                    <Historic_1880_DataLayer/>
                    <Historic_1911_DataLayer/>
                    <Historic_1945_DataLayer/>
                    <BoroughBoundaryLayer/>
                    <ParcelBoundaryLayer/>
                    <FloodBoundaryLayer/>
                    <VistaBoundaryLayer/>
                    <HousingBoundaryLayer/>
                    <CreativeBoundaryLayer/>
                    <BuildingNumbersLayer revisionId={revisionId} />
                    {
                        selectedBuildingId &&
                            <BuildingHighlightLayer
                                selectedBuildingId={selectedBuildingId}
                                baseTileset={mapColourScale} 
                            />
                    }
                </Pane>
                <Pane
                    name='cc-label-overlay-pane'
                    style={{zIndex: 1000}}
                >
                    <BoroughLabelLayer/>
                </Pane>

                {/* <ZoomControl position="topright" /> */}
                {/* <GeolocationButton refProp={currentLocationButtonRef}/> */}
                {/* #TODO: extract to custom exlement like GeolocationButton */}
                {/* #TODO: props: position parse: topright -> leaflet-top leaflet-right */}
                {/* {showAttribution ? <AttributionControl prefix=""/> : <></>}
                <div className="leaflet-control-container">
                <div className="leaflet-bottom leaflet-left">
                    <button ref={toggleAttributionButtonRef} className="leaflet-control leaflet-bar toggle-attribution" onClick={toggleAttribution} title="Quellen und Mitwirkende anzeigen">
                        <CopyrightIcon />
                    </button>
                </div>
                </div> */}

                {/* <div className="leaflet-control-container">
                <div className="leaflet-bottom leaflet-right">
                    <button ref={toggleLegendButtonRef} className="leaflet-control leaflet-bar toggle-legend" onClick={toggleLegend} title="Kartenlegende anzeigen">
                        <LegendIcon />
                    </button>
                </div>
                </div> */}

                {/* <MapControls ref={mapControlsRef}/> */}
                <MapControls setLegendVisibility={setShowLegend}/>
                {/* <ZoomControl position="topright" />
                <MapCurrentGeoLocationControl />
                <MapAttributionControl /> */}
                {/* <MapLegendControl ref={toggleLegendButtonRef} /> */}
                {/* <MapLegendControl toggleControl={setShowLegend} /> */}
            </MapContainer>
            {
                mode !== 'basic' &&
                <>
                    {/* { toggleLegendButtonRef.current.isVisible
                        ? <Legend mapColourScaleDefinitions={categoryMapDefinitions} mapColourScale={mapColourScale} onMapColourScale={onMapColourScale}
                            collapseLegendList={!toggleLegendButtonRef.current.isVisible} showLegendCollapse={!isMobileWidth}
                        />
                        : <></>
                    } */}
                    {/* { mapControlsRef.current?.isLegendVisible()
                        ? <Legend mapColourScaleDefinitions={categoryMapDefinitions} mapColourScale={mapColourScale} onMapColourScale={onMapColourScale}
                            collapseLegendList={!mapControlsRef.current?.isLegendVisible()} showLegendCollapse={!isMobileWidth}
                        />
                        : <></>
                    } */}
                    { showLegend
                        ? <Legend mapColourScaleDefinitions={categoryMapDefinitions} mapColourScale={mapColourScale} onMapColourScale={onMapColourScale}
                            collapseLegendList={!showLegend} showLegendCollapse={!isMobileWidth}
                        />
                        : <></>
                    }
                    <ThemeSwitcher onSubmit={darkLightThemeSwitch} currentTheme={darkLightTheme} />
                    <DataLayerSwitcher />
                    {
                        (showLayerSelection == "enabled") ?
                        <>
                            <BoroughSwitcher/>
                            {/* <ParcelSwitcher/> */}
                            {/* <FloodSwitcher/> */}
                            {/* <ConservationAreaSwitcher/> */}
                            <HistoricDataSwitcher/>
                            {/* <VistaSwitcher /> */}
                            {/* <HousingSwitcher /> */}
                            {/* <CreativeSwitcher /> */}
                            <Historic_1911_DataSwitcher/>
                            <Historic_1945_DataSwitcher/>                            
                            <Historic_1880_DataSwitcher/>


                        </>
                        : <></>
                    }
                    {/* TODO change remaining ones*/}
                    {/* <SearchBox onLocate={handleLocate} /> */}
                </>
            }
        </div>
    );
}

function ClickHandler({ onClick }: {onClick: (e1: unknown) => void}) {
    const map = useMapEvent('click', (e2) => {
        console.debug("Map: useMapEvent: click:", {mapSize: map.getSize(), options: map.options, container: map.getContainer(), e2, eventPath: e2?.originalEvent?.composedPath()});
        onClick(e2);
    });
    
    return null;
}

const ResizeHandler = ({
    building,
    mapClickLatLng,
} : {
    building: Building | null,
    // mapClickLatLng: Coordinates,
    mapClickLatLng: {lat: number, lng: number} | null,
}) => {
    const map = useMap();

    useEffect(() => {
        console.debug("Map: ResizeHandler: useEffect:", {mapSize: map.getSize(), options: map.options, container: map.getContainer(), building});
        const mapContainer = map.getContainer();
        const observer = new ResizeObserver(() => {
            const center = map.getCenter();
            console.debug("Map: ResizeHandler: ResizeObserver:", {building, building_coordinates: {lat: building?.location_latitude, lng: building?.location_longitude}, center, mapSize: map.getSize(), options: map.options, container: map.getContainer()});
            const newView = {lat: center.lat, lng: center.lng};

            const pivot = {lat: center.lat, lng: center.lng};

            // if (
            //     typeof mapClickLatLng?.lat === 'number' &&
            //     typeof mapClickLatLng?.lng === 'number' &&
            //     !isNaN(mapClickLatLng.lat) &&
            //     !isNaN(mapClickLatLng.lng)
            // ) {
            //     // map.invalidateSize();
            //     newView.lat = mapClickLatLng.lat
            //     newView.lng = mapClickLatLng.lng
            //     // map.setView([mapClickLatLng.lat, mapClickLatLng.lng], map.getZoom());
            // } else {
                const _zoom = map.getZoom();
                const mapBounds = map.getBounds();
                const containerHeight = mapContainer.offsetHeight;
                const containerWidth = mapContainer.offsetWidth;

                const mapTop = mapBounds.getNorth();
                const mapBottom = mapBounds.getSouth();
                const mapLeft = mapBounds.getWest();
                const mapRight = mapBounds.getEast();

                const projectedTop = map.project([center.lat, mapTop], _zoom);
                const projectedBottom = map.project([center.lat, mapBottom], _zoom);
                const projectedLeft = map.project([mapLeft, center.lng], _zoom);
                const projectedRight = map.project([mapRight, center.lng], _zoom);

                const projectedTopToleratedY = projectedTop.y + containerHeight / 5;
                const projectedBottomToleratedY = projectedBottom.y - containerHeight / 5;
                const projectedLeftToleratedX = projectedLeft.x + containerWidth / 5;
                const projectedRightToleratedX = projectedRight.x - containerWidth / 5;

                if (building) {
                    if ( 
                        typeof building?.location_latitude === 'number' &&
                        typeof building?.location_longitude === 'number' &&
                        !isNaN(building.location_latitude) &&
                        !isNaN(building.location_latitude)
                    ) {
                        pivot.lat = building.location_latitude;
                        pivot.lng = building.location_longitude;
                    } else {
                        if (
                            typeof mapClickLatLng?.lat === 'number' &&
                            typeof mapClickLatLng?.lng === 'number' &&
                            !isNaN(mapClickLatLng.lat) &&
                            !isNaN(mapClickLatLng.lng)
                        ) {
                            pivot.lat = mapClickLatLng.lat;
                            pivot.lng = mapClickLatLng.lng;
                        }
                        // } else {
                        //     pivot.lat = center.lat;
                        //     pivot.lng = center.lng;
                        // }
                    }
                    const projectedPivot = map.project([pivot.lat, pivot.lng], _zoom);
                    console.debug("Map: ResizeHandler: ResizeObserver: projectedPivot", {
                        projectedPivot,
                        building,
                        building_coordinates: {lat: building.location_latitude, lng: building.location_longitude},
                        toleratedWindow: {projectedTopToleratedY, projectedBottomToleratedY, projectedLeftToleratedX, projectedRightToleratedX},
                        isTopLimit: projectedPivot.y < projectedTopToleratedY,
                        isBottomLimit: projectedPivot.y > projectedBottomToleratedY,
                        isLeftLimit: projectedPivot.x < projectedLeftToleratedX,
                        isRightLimit: projectedPivot.x > projectedRightToleratedX,
                        mapSize: map.getSize(),
                        options: map.options,
                        container: map.getContainer(),
                    });
                    if (
                        projectedPivot.y < projectedTopToleratedY ||
                        projectedPivot.y > projectedBottomToleratedY ||
                        projectedPivot.x < projectedLeftToleratedX ||
                        projectedPivot.x > projectedRightToleratedX
                    ) {
                        console.debug("Map: ResizeHandler: ResizeObserver: projectedPivot: newView: ", {newView, pivot, building, building_coordinates: {lat: building.location_latitude, lng: building.location_longitude}, center});
                        newView.lat = pivot.lat;
                        newView.lng = pivot.lng;
                    }
                }

                // const topTolerated = map.unproject([projectedTop.x, projectedTopToleratedY], _zoom);
                // const bottomTolerated = map.unproject([projectedBottom.x, projectedBottomToleratedY], _zoom);
                // const leftTolerated = map.unproject([projectedLeftToleratedX, projectedRight.y], _zoom);
                // const rightTolerated = map.unproject([projectedRightToleratedX, projectedRight.y], _zoom);
            // }
            map.invalidateSize();
            if (newView.lat !== center.lat || newView.lng !== center.lng) {
                map.setView([newView.lat, newView.lng], map.getZoom());
            }
        });
        observer.observe(mapContainer);
        return () => {
            observer.unobserve(mapContainer);
        }
    }, [
        map,
        // building,
        building?.location_latitude,
        building?.location_longitude,
        // mapClickLatLng,
        mapClickLatLng?.lat,
        mapClickLatLng?.lng,
    ])

    return null;
}

// // interface Coordinates {
// //     lat: number;
// //     lng: number;
// // }
// const ResizeHandler = ({
//     mapClickLatLng
// } : {
//     // mapClickLatLng: Coordinates,
//     mapClickLatLng: {lat: number, lng: number} | null,
// }) => {
//     const map = useMap();

//     useEffect(() => {
//         // console.debug("Map: ResizeHandler: useEffect:", {mapSize: map.getSize(), options: map.options, container: map.getContainer()});
//         const mapContainer = map.getContainer();
//         const observer = new ResizeObserver(() => {
//             // console.debug("Map: ResizeHandler: ResizeObserver:", {mapSize: map.getSize(), options: map.options, container: map.getContainer()});
//             const center = map.getCenter();
//             const newView = {lat: center.lat, lng: center.lng};
//             if (
//                 typeof mapClickLatLng?.lat === 'number' &&
//                 typeof mapClickLatLng?.lng === 'number' &&
//                 !isNaN(mapClickLatLng.lat) &&
//                 !isNaN(mapClickLatLng.lng)
//             ) {
//                 // map.invalidateSize();
//                 newView.lat = mapClickLatLng.lat
//                 newView.lng = mapClickLatLng.lng
//                 // map.setView([mapClickLatLng.lat, mapClickLatLng.lng], map.getZoom());
//             } else {
//                 const mapBounds = map.getBounds();
//                 const containerHeight = mapContainer.offsetHeight;
//                 const _zoom = map.getZoom();
//                 const topLat = mapBounds.getNorth();
//                 const projectedTopLat = map.project([topLat, center.lng], _zoom);
//                 const newCenterPixelY = projectedTopLat.y + containerHeight / 2;
//                 const newCenter = map.unproject([projectedTopLat.x, newCenterPixelY], _zoom);
//                 newView.lat = newCenter.lat;
//                 // newView.lng = newCenter.lng;
//                 newView.lng = center.lng;
//                 // map.invalidateSize();
//                 // map.setView([newCenter.lat, center.lng], _zoom);
//             }
//             map.invalidateSize();
//             map.setView([newView.lat, newView.lng], map.getZoom());
//         });
//         observer.observe(mapContainer);
//         return () => {
//             observer.unobserve(mapContainer);
//         }
//     }, [
//         map,
//         // building?.lat,
//         // building?.lng,
//         mapClickLatLng?.lat,
//         mapClickLatLng?.lng,
//     ])

//     return null;
// }

// function ResizeHandler() {
//     const map = useMap();

//     useEffect(() => {
//         // console.debug("Map: ResizeHandler: useEffect:", {mapSize: map.getSize(), options: map.options, container: map.getContainer()});
//         const mapContainer = map.getContainer();
//         const observer = new ResizeObserver(() => {
//             // console.debug("Map: ResizeHandler: ResizeObserver:", {mapSize: map.getSize(), options: map.options, container: map.getContainer()});
//             map.invalidateSize();
//         });
//         observer.observe(mapContainer);
//         return () => {
//             observer.unobserve(mapContainer);
//         }
//     }, [map])

//     return null;
// }
// function ResizeHandler() {
//     const map = useMapEvent('resize', (e) => {
//         console.debug("Map: useMapEvent: resize:", {mapSize: map.getSize(), options: map.options, container: map.getContainer()});
//         map.invalidateSize(true);
//     });
    
//     return null;
// }

function MapBackgroundColor({ theme}: {theme: MapTheme}) {
    const map = useMap();
    useEffect(() => {
        map.getContainer().style.backgroundColor = mapBackgroundColor[theme];
    });

    return null;
}

function MapViewport({
    position,
    zoom
}: {
    position: [number, number];
    zoom: number;
}) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, zoom)
    }, [position, zoom]);

    return null;
}

/* move map to current position after onClick button */

// function GeolocationButton({refProp}) {
//     const map = useMap();
//     const handleClick = () => {
        
//         map.locate().on("locationfound", function (e) {
            

//             console.log(e.latlng);
//             map.flyTo(e.latlng, map.getZoom());
//         });
//     }

//     return (
//         <div className="leaflet-control-container">
//         <div className="leaflet-top leaflet-right">
//         <button ref={refProp} className="btn-geolocation leaflet-control" onClick={handleClick}>
//             <img className="btn-geolocation-icon" src="/images/map-marker-alt-solid.svg" alt="Markersymbol, gehe zu aktueller Position"></img>
//         </button>
//         </div>
//         </div>
//     );
// }

// const GeolocationButtonRef = forwardRef<typeof GeolocationButton, {}>(({}, ref) => {
//     const localRef = useRef<typeof GeolocationButton | null>(null);
//     useImperativeHandle(ref, () => localRef.current, [localRef])
//     return <GeolocationButton refProp={localRef}/>
// })
