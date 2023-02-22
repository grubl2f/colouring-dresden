import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import InfoBox from '../components/info-box';


interface BuildingNotFoundProps {
  mode: string;
}

const BuildingNotFound: React.FunctionComponent<BuildingNotFoundProps> = (props) => (
  <Fragment>
    <InfoBox msg="Das Gebäude kann nicht gefunden werden - vielleicht probieren Sie es erneut?" />
    <div className="buttons-container ml-3 mr-3">
        <Link to={`/${props.mode}/categories`} className="btn btn-secondary">Zurück zu Kategorien</Link>
    </div>
  </Fragment>
);

export default BuildingNotFound;
