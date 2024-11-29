import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BackIcon } from '../components/icons';


import './container-header.css';

import { useDragResize } from '../hooks/use-drag-resize';
import { useViewSize } from '../hooks/use-view-size';

interface ContainerHeaderProps {
    cat?: string;
    backLink?: string;
    title: string;

    children?: React.ReactNode;
    onMove?: (dx: number, dy: number) => void;
}

type PointerStart = {
    x: number;
    y: number;
}

const ContainerHeader: React.FunctionComponent<ContainerHeaderProps> = (props: ContainerHeaderProps) => {
    const thisRef = useRef<HTMLDivElement | null>(null)
    const { isMobileWidth } = useViewSize(0);
    const { onMouseDown } = useDragResize(thisRef.current, props.onMove);
    return <header ref={thisRef}
            className={`section-header view ${props.cat ? props.cat : ''} ${props.cat ? `background-${props.cat}` : ''}`}
            onPointerDown={isMobileWidth ? onMouseDown : null}
        >
            <h2 className="h2">
                {props.backLink && 
                    <Link className="icon-button back" to={props.backLink}>
                        <BackIcon />
                    </Link>
                }
                {props.title}
            </h2>
            <nav className="section-header-actions">
                {props.children}
            </nav>
        </header>
};

export default ContainerHeader;
