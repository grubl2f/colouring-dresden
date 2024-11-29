import React, { useState, Fragment, useEffect, useCallback, useRef } from 'react';

import './sidebar.css';
import { BackIcon, ForwardIcon } from '../components/icons';
import { DownIcon, UpIcon } from '../components/icons';
import { BackDownIcon, ForwardUpIcon } from '../components/icons';
import { useViewSize } from '../hooks/use-view-size';
import { disableLeafletClickPropagation } from '../map/map-utils';
import { useDragResize } from '../hooks/use-drag-resize';

//import { MapContainer, useMapEvent, ZoomControl, Pane, useMap } from 'react-leaflet';


//import { useMap } from 'react-leaflet';
import { useMapEvent } from 'react-leaflet';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean | ((prevState: boolean) => boolean)) => void;
    onResize?: (dX: number, dY: number) => void;
    children?: React.ReactNode; 
}

const isMouseOrPointerEvent = (
    e: React.PointerEvent | React.MouseEvent | React.TouchEvent
): e is React.PointerEvent | React.MouseEvent => {
    return 'button' in e;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, onResize, children}) => {
    const { isMobileWidth } = useViewSize(0);
    const clickTimeout = useRef(null);
    const hasDragged = useRef(false);
    //const map = useMap();

    // #TODO: SSR-only ? check if still required
    const collapseButtonRef = useRef<HTMLButtonElement | null>(null);
    const initCollapseButtonRef = useCallback((element: HTMLButtonElement | null) => {
        collapseButtonRef.current = element;
        // disableLeafletClickPropagation(element, map.DomEvent.disableClickPropagation);
    }, []);

    const { onMouseDown: onPointerDown } = useDragResize(collapseButtonRef.current, (dX: number, dY: number) => {
        // stop collapse if resize was called from the useDragResize hook (if move/drag was detected)
        console.debug("Sidebar: onPointerDown: useDragResize: onResize:", {isMobileWidth, clickTimeout, onResize, hasDragged: hasDragged.current});
        hasDragged.current = true;
        if (onResize) {
            onResize(dX, dY);
        }
    });

    const handlePointerDown = useCallback((e) => {
        console.debug("Sidebar: collapseButton: handlePointerDown:", {e, isMobileWidth, clickTimeout, onResize});
        hasDragged.current = false;
        onPointerDown(e);
    }, [
        onPointerDown,
    ]);
    const handlePointerUp = useCallback((e) => {
        if (!hasDragged.current) {
            console.debug("Sidebar: collapseButton: handlePointerUp:", {e, isMobileWidth, clickTimeout, onResize});
            setCollapsed((p) => !p);
        }
    }, [
    ]);

    const [CollapseIcon, setCollapseIcon] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        console.debug("Sidebar: debug setting the collapse icon component: ", {collapsed, isMobileWidth, CollapseIcon, ForwardUpIcon, ForwardIcon, BackDownIcon, BackIcon});
        setCollapseIcon(() => (collapsed
            ? (isMobileWidth ? ForwardUpIcon : ForwardIcon)
            : (isMobileWidth ? BackDownIcon : BackIcon)
        ))
    }, [
        isMobileWidth,
        collapsed,
    ])

    return (
        <Fragment>
        <div id="sidebar" className={"info-container " + (collapsed ? "offscreen" : "")}>
            <button className="info-container-collapse btn btn-light"
                onPointerDown={(e) => {
                    console.debug("Sidebar: onPointerDown:", {isMobileWidth, clickTimeout, onResize, e});
                    handlePointerDown(e);
                }}
                onPointerUp={(e) => {
                    console.debug("Sidebar: onPointerUp:", {isMobileWidth, clickTimeout, onResize, e});
                    handlePointerUp(e);
                }}
                ref={initCollapseButtonRef}
                >
                {CollapseIcon ? <CollapseIcon /> : null}
            </button>
            <div className="info-container-inner">
                { children }
            </div>
        </div>
        </Fragment>
    );
}

export default Sidebar;
