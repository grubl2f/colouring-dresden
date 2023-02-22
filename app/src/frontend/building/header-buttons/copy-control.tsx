import React from 'react';
import { NavLink } from 'react-router-dom';

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
                className="icon-button copy">
                Kopie ausgewählt
            </NavLink>
            <a
                className="icon-button copy"
                onClick={props.toggleCopying}>
                Abbruch
            </a>
        </>
        :
        <a
            className="icon-button copy"
            onClick={props.toggleCopying}>
            Kopie
        </a>
);

export {
    CopyControl
};
