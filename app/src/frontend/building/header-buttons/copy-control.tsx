import React from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faWindowClose, faCheckSquare } from '@fortawesome/free-solid-svg-icons'

interface CopyControlProps {
    cat: string;
    data_string: string;
    copying: boolean;
    toggleCopying: () => void;
}

const CopyControl: React.FC<CopyControlProps> = props => (
    props.copying ?
        <>
            <NavLink
                to={`/multi-edit/${props.cat}?data=${props.data_string}`}
                className="icon-button copy"
                title="Kopie ausgewählt"
            >
                <FontAwesomeIcon icon={faCheckSquare} />
            </NavLink>
            <a
                href="#"
                className="icon-button copy"
                onClick={props.toggleCopying}
                title="Abbruch"
            >
                <FontAwesomeIcon icon={faWindowClose} />
            </a>
        </>
        :
        <a
            href="#"
            className="icon-button copy"
            onClick={props.toggleCopying}
            title="Kopie"
        >
            <FontAwesomeIcon icon={faCopy} />
        </a>
);

export {
    CopyControl
};
