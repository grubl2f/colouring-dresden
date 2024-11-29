import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';

import { useRevisionId } from './api-data/use-revision';
import { useBuildingData } from './api-data/use-building-data';
import { useUserVerifiedData } from './api-data/use-user-verified-data';
import { useUrlBuildingParam } from './nav/use-url-building-param';
import { useUrlCategoryParam } from './nav/use-url-category-param';
import { useUrlModeParam } from './nav/use-url-mode-param';
import BuildingView from './building/building-view';
import Categories from './building/categories';
import { EditHistory } from './building/edit-history/edit-history';
import MultiEdit from './building/multi-edit';
import Sidebar from './building/sidebar';
import { Building, UserVerified } from './models/building';
import Welcome from './pages/welcome';
import { PrivateRoute } from './route';
import { useLastNotEmpty } from './hooks/use-last-not-empty';
import { Category } from './config/categories-config';
import { BuildingMapTileset } from './config/tileserver-config';
import { defaultMapCategory, categoryMapsConfig } from './config/category-maps-config';
import { useMultiEditData } from './hooks/use-multi-edit-data';
import { useAuth } from './auth-context';
import { sendBuildingUpdate } from './api-data/building-update';
import { useViewSize } from './hooks/use-view-size';

/**
 * Load and render ColouringMap component on client-side only.
 * This is because leaflet and react-leaflet currently don't work on the server
 * (leaflet assumes the presence of browser-specific global `window` variable).
 * 
 * The previous solution involved installing react-leaflet-universal,
 * but that doesn't work with latest react-leaflet.
 * 
 * The limitation is that ColouringMap needs to be the single entry point in the whole app
 * to all modules that import leaflet or react-leaflet.
 */
const ColouringMap = loadable(
    async () => (await import('./map/map')).ColouringMap,
    { ssr: false }  
);

interface MapAppProps {
    building?: Building;
    revisionId?: string;
    user_verified?: object;
}

/** Returns first argument, unless it's equal to the second argument - then returns undefined */
function unless<V extends string, U extends V>(value: V, unlessValue: U): Exclude<V, U> {
    return value === unlessValue ? undefined : value as Exclude<V, U>;
}

/** Returns the new value, unless it is equal to the current value - then returns undefined */
function setOrToggle<T>(currentValue: T, newValue: T): T {
    if(newValue == undefined || newValue === currentValue){
        return undefined;
    } else {
        return newValue;
    }
}

function useStateWithOptions<T>(defaultValue: T, options: T[]): [T, (x: T) => void] {
    const [value, setValue] = useState(defaultValue);

    const effectiveValue = options.includes(value) ? value : options[0];
    const handleChange = useCallback((x) => setValue(x), []);

    return [effectiveValue, handleChange];
}

export const MapApp: React.FC<MapAppProps> = props => {
    const { user } = useAuth();
    const [categoryUrlParam] = useUrlCategoryParam();

    const [currentCategory, setCategory] = useState<Category>();

    const { width: screenWidth, height: screenHeight, isMobileWidth, wasMobileWidth } = useViewSize(0)

    useEffect(() => setCategory(unless(categoryUrlParam, 'categories')), [categoryUrlParam]);

    const [collapsed, setCollapsed] = useState<boolean | undefined>(false);

    const checkDefaultCollapsed = useCallback(() => {
        const v = {
            isMobileWidth,
            isCurrentCategoryNotUndefined: currentCategory !== undefined,
            isCurrentCategoryKnown: Object.values(Category).includes(currentCategory as Category),
            isNotWelcomeCat: (currentCategory as Category) !== Category.Welcome,
        }
        console.debug("MapApp: checkDefaultCollapsed:", {...v, collapsed, isMobileWidth, currentCategory})
        setTimeout(() => {
            console.debug("MapApp: checkDefaultCollapsed: delayed:", {...v, collapsed, isMobileWidth, currentCategory});
        }, 500);
        return Object.values(v).every(v => v)
    }, [
        isMobileWidth,
        currentCategory,
    ])
    
    const displayCategory = useLastNotEmpty(currentCategory) ?? defaultMapCategory;
    useEffect(() => {
        console.debug("MapApp: init collapsed:", {collapsed, isMobileWidth, currentCategory, displayCategory })
        setCollapsed(checkDefaultCollapsed());
    }, []);
    
    const [selectedBuildingId, setSelectedBuildingId] = useUrlBuildingParam('view', displayCategory);
    
    const [building, updateBuilding, reloadBuilding] = useBuildingData(selectedBuildingId, props.building, user != undefined);
    const [userVerified, updateUserVerified, reloadUserVerified] = useUserVerifiedData(selectedBuildingId, props.user_verified);
    
    const [revisionId, updateRevisionId] = useRevisionId(props.revisionId);
    useEffect(() => {
        updateRevisionId(building?.revision_id)
    }, [building]);
    
    const [mode] = useUrlModeParam();
    const viewEditMode = unless(mode, 'multi-edit');
    
    const [multiEditData, multiEditError] = useMultiEditData();

    const selectBuilding = useCallback((selectedBuilding: Building) => {
        const currentId = selectedBuildingId;
        console.debug("selectBuilding:", {selectedBuildingId, building});
        updateBuilding(selectedBuilding);
        setSelectedBuildingId(setOrToggle(currentId, selectedBuilding?.building_id));
    }, [selectedBuildingId, setSelectedBuildingId, updateBuilding, building]);

    const colourBuilding = useCallback(async (building: Building) => {
        const buildingId = building?.building_id;
        console.debug("colourBuilding:", {buildingId, building});

        if(buildingId != undefined && multiEditError == undefined) {
            try {
                const updatedBuilding = await sendBuildingUpdate(buildingId, multiEditData);
                updateRevisionId(updatedBuilding.revision_id);
            } catch(error) {
                console.error({ error });
            }
        }
    }, [multiEditError, multiEditData, currentCategory]);

    const handleBuildingUpdate = useCallback((buildingId: number, updatedData: Building) => {
        // only update current building data if the IDs match
        if(buildingId === selectedBuildingId) {
            updateBuilding(Object.assign({}, building, updatedData));
        } else {
            // otherwise, still update the latest revision ID
            updateRevisionId(updatedData.revision_id);
        }
    }, [selectedBuildingId, building, updateBuilding, updateRevisionId]);

    const handleUserVerifiedUpdate = useCallback((buildingId: number, updatedData: UserVerified) => {
        // only update current building data if the IDs match
        if(buildingId === selectedBuildingId) {
            updateUserVerified(Object.assign({}, userVerified, updatedData)); // quickly show added verifications
            reloadBuilding();
            reloadUserVerified(); // but still reload from server to reflect removed verifications
        }
    }, [selectedBuildingId, updateUserVerified, reloadBuilding, userVerified]);


    const categoryMapDefinitions = useMemo(() => categoryMapsConfig[displayCategory], [displayCategory]);
    const availableMapStyles = useMemo(() => categoryMapDefinitions.map(x => x.mapStyle), [categoryMapDefinitions]);
    const [mapColourScale, setMapColourScale] = useStateWithOptions<BuildingMapTileset>(undefined, availableMapStyles);
    const [sidebarContentHeight, setSidebarContentHeight] = useState(0);
    const handleMoveHeader = useCallback((dX: number, dY: number) => {
        console.debug("MapApp: handleMoveHeader:", {dX, dY, screenHeight, sidebarContentHeight})
        setSidebarContentHeight((prevHeight) => {
            const newHeight = Math.min(screenHeight, Math.max(0, prevHeight - dY));
            console.debug("MapApp: handleMoveHeader: setSidebarContentHeight: newHeight:", {prevHeight, newHeight, dX, dY, screenHeight, max: Math.max(0, prevHeight - dY), min: Math.min(screenHeight, Math.max(0, prevHeight - dY))}, )
            return newHeight;
        });
    }, [
      screenHeight,
   ]);
//    }, []);

    useEffect(() => {
        console.debug("MapApp: useEffect: screenHeight, sidebarContentHeight:", {screenHeight, sidebarContentHeight})
//        setScreenHeigh(window?.innerHeight);
    }, [
        screenHeight,
        sidebarContentHeight,
//        window,
//        window?.innerHeight,
    ]);



    return (
        <>
            <PrivateRoute path="/:mode(edit|multi-edit)" /> {/* empty private route to ensure auth for editing */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onResize={handleMoveHeader}>
                <Switch>
                    <Route exact path="/">
                        <Categories mode={'view'} building_id={selectedBuildingId} />
                        <BuildingView
                            mode={'view'}
                            cat={Category.Welcome}
                            building={building}
                            user_verified={userVerified ?? {}}
                            onBuildingUpdate={handleBuildingUpdate}
                            onUserVerifiedUpdate={handleUserVerifiedUpdate}
                            mapColourScale={mapColourScale}
                            onMapColourScale={setMapColourScale}

                            collapsed={collapsed}
                            onResize={handleMoveHeader}
                            contentHeight={sidebarContentHeight}
                        />
                    </Route>
                    <Route exact path="/multi-edit/:cat">
                        <MultiEdit category={displayCategory} />
                    </Route>
                    <Route path="/:mode/:cat">
                        <Categories mode={mode || 'view'} building_id={selectedBuildingId} />
                        <Switch>
                            <Route exact path="/:mode/:cat/:building/history">
                                <EditHistory building={building} />
                            </Route>
                            <Route exact path="/:mode/:cat/:building?">
                                <BuildingView
                                    mode={viewEditMode}
                                    cat={displayCategory}
                                    building={building}
                                    user_verified={userVerified ?? {}}
                                    onBuildingUpdate={handleBuildingUpdate}
                                    onUserVerifiedUpdate={handleUserVerifiedUpdate}
                                    mapColourScale={mapColourScale}
                                    onMapColourScale={setMapColourScale}

                                    collapsed={collapsed}
                                    onResize={handleMoveHeader}
                                    contentHeight={sidebarContentHeight}
                                />
                            </Route>
                        </Switch>
                    </Route>
                    <Route exact path="/:mode(view|edit|multi-edit)"
                        render={props => (<Redirect to={`/${props.match.params.mode}/categories`} />)}
                    />
                </Switch>
            </Sidebar>
            <ColouringMap
                selectedBuildingId={selectedBuildingId}
                mode={mode || 'basic'}
                revisionId={revisionId}
                onBuildingAction={mode === 'multi-edit' ? colourBuilding : selectBuilding}
                mapColourScale={mapColourScale}
                onMapColourScale={setMapColourScale}
                categoryMapDefinitions={categoryMapDefinitions}
                building={building}
            />
        </>
    );
};
