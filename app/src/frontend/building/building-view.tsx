import React, { useEffect } from 'react';
import { useAuth } from '../auth-context';

import { categoriesConfig, Category } from '../config/categories-config';
import { categoryUiConfig } from '../config/category-ui-config';
import { Building, UserVerified } from '../models/building';
import { BuildingMapTileset } from '../config/tileserver-config';

import BuildingNotFound from './building-not-found';

interface BuildingViewProps {
    cat: Category;
    mode: 'view' | 'edit';
    building?: Building;
    user_verified?: any;
    onBuildingUpdate: (buildingId: number, updatedData: Building) => void;
    onUserVerifiedUpdate: (buildingId: number, updatedData: UserVerified) => void;
    mapColourScale: BuildingMapTileset;
    onMapColourScale: (x: BuildingMapTileset) => void;

    collapsed: boolean;
    // setCollapsed: (collapsed: boolean | ((prevState: boolean) => boolean)) => void;
    onResize: (dX: number, dY: number) => void;
    contentHeight: number;
}

/**
 * Top-level container for building view/edit form
 *
 * @param props
 */
const BuildingView: React.FunctionComponent<BuildingViewProps> = (props) => {
    const { user } = useAuth();
    const DataContainer = categoryUiConfig[props.cat];
    
    const categoryConfig = categoriesConfig[props.cat];

    if(categoryConfig == undefined) {
        return <BuildingNotFound mode="view" />;
    }

    const {
        name,
        aboutUrl,
        intro,
        inactive = false
    } = categoryConfig;

    useEffect(() => {
        console.debug("BuildingView: useEffect:", props)
    }, [
        props.contentHeight,
        props.onResize,
        props.collapsed,
    ])

    return <DataContainer
        {...props}
        title={name}
        help={aboutUrl}
        intro={intro}
        inactive={inactive}
        user={user}
        mapColourScale={props.mapColourScale}
        onMapColourScale={props.onMapColourScale}

        collapsed={props.collapsed}
        // setCollapsed={props.setCollapsed}
        onMoveHeader={props.onResize}
        contentHeight={props.contentHeight}
    />; 
};

export default BuildingView;
