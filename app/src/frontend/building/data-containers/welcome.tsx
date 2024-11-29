import React, { Fragment } from 'react';
import InfoBox from '../../components/info-box';
import { dataFields } from '../../config/data-fields-config';
import SelectDataEntry from '../data-components/select-data-entry';
import NumericDataEntry from '../data-components/numeric-data-entry';
import Verification from '../data-components/verification';
import { MultiDataEntry } from '../data-components/multi-data-entry/multi-data-entry';
import { LogicalDataEntry, LogicalDataEntryYesOnly } from '../data-components/logical-data-entry/logical-data-entry';
import { DataEntryGroup } from '../data-components/data-entry-group';

import withCopyEdit from '../data-container';

import { CategoryViewProps } from './category-view-props';

import { CCConfig } from '../../../cc-config';
import rawConfig from '../../../cc-config.json';
const config: CCConfig = rawConfig as CCConfig;

import './welcome.css';

import { Link } from 'react-router-dom';

/**
* Welcome view/edit section
*/
const WelcomeView: React.FunctionComponent<CategoryViewProps> = (props) => {
    const building = props.building;
    // const currentYear = new Date().getFullYear();
    // const currentBuildingConstructionYear = building.date_year || undefined;
      return (
       <form>
        <p>
            Wie alt sind die Gebäude Dresdens? Aus welchen Materialien wurden sie überwiegend erbaut? Und wie gut sind sie baulich vorbereitet, um mit extremen Ereignissen wie Starkregen, Hochwasser oder Hitze umgehen zu können?
        </p>
        <p>
            Um solche und weitere Fragen beantworten zu können, soll Wissen zu den Gebäuden der Stadt {config.cityName} für verschiedene Merkmale in einer offenen Wissensplattform erfasst, 
            in Karten visualisiert und als offene Daten bereitgestellt werden.
            
            Sie interessieren sich für die Gebäude der Stadt {config.cityName} haben und möchten Ihr Wissen in einer interaktiven Karte erfassen und teilen? Dann sind Sie auf der Plattform "Colouring {config.cityName}" genau richtig!
        </p>
        <p>
            <b>Wie kann ich mitmachen?</b>
        </p>
        <p>
            Sie können individuell beginnen und Gebäudemerkmale eintragen - egal ob am heimischen Computer oder draußen an der frischen Luft. Einfach registieren und loslegen.
            Weiterhin werden unterschiedliche Veranstaltungen wie Vorträge, Spaziergänge ("Mapathons") und ein (digitaler) monatlicher Stammtisch zum Erfahrungsaustausch angeboten.
            Weitere Informationen gibt es im <a href="https://seu2.cleverreach.com/f/203678-351100/" target="_blank">Newsletter</a> oder auf der <a href="https://colouring.dresden.ioer.info" target="_blank">Projektwebseite</a>.
        </p>
        <p>
            <b>Zum Projekt:</b>
        </p>
        <p>
            Die Plattform Colouring {config.cityName} wird im Rahmen des Citizen Science Projektes "Baukultur und klimagerechte Architektur in Dresden. Gebäudewissen kartieren, erforschen und vermitteln"
            weiterentwickelt und für das gemeinsame Erfassen der Gebäudemerkmale genutzt. 
            Weitere Informationen sind  <a href="https://colouring.dresden.ioer.info" target="_blank">hier auf der Projektwebseite</a> zu finden.
        </p>
        <p>
            Colouring {config.cityName} ist Teil des internationalen Forschungsnetzwerkes Colouring Cities Research Programme (CCRP), welches
            am Alan Turing Institut angesiedelt ist (dem nationalen Institut des Vereinigten Königreichs für Data Science und künstliche Intelligenz). 
            Das Forschungsnetzwerk arbeitet mit lokalen, regionalen, nationalen und internationalen Partnern an der Weiterentwicklung des offenen Programmcodes, 
            und kann auf weitere Städte übertragen werden. Das Forschungsnetzwerk CCRP pflegt ein <a href="https://github.com/colouring-cities/manual/wiki" target="_blank">offenes Wiki</a> auf GitHub,
            um über die Entwicklung und Aktivitäten zu informieren.
        </p>
        <p>
            Neue Datensätze oder Funktionen werden kontinuierlich ergänzt. Für Ihre Mitwirkung bei der Erfassung oder Verifikation von Gebäudemerkmalen sind wir dankbar!
        </p>
        <p>
            Die <Link to="/data-extracts.html">Daten</Link> sowie der <a href="https://github.com/colouring-cities/colouring-dresden" target="_blank">Programmcode</a> stehen frei zum Herunterladen unter offenen Lizenzen bereit. 
        </p>
        <p>
            Schön, dass Sie zu Colouring {config.cityName} gefunden haben!
            Und nun viel Spaß beim Entdecken, Erfassen und Erforschen des Gebäudebestandes der Stadt Dresden.
        </p>

        <Link to="/view/categories"
            className="btn btn-outline-dark btn-lg btn-block">
            <b>Let´s colour {config.cityName}!</b>
        </Link>
        <div className="image-row">
            <a href="https://ioer.de/" target="_blank">
                <img className="cl-logo" src="/images/logo-ioer-de.svg" alt="Leibniz-Institut für ökologische Raumentwicklung (IÖR) e.V."></img>
            </a>
            <a href="https://pages.colouring.london/colouring-cities" target="_blank">
                <img className="cl-logo" src="/images/logo-cc.jpg" alt="Colouring Cities Research Programme"></img>
            </a>
            
        </div>
        <div className="image-row">
            <a href="https://www.citizenscience-wettbewerb.de/" target="_blank">
                <img className="cl-logo" src="/images/AdP Banner Wortmarke 560x300 300dpi (3) (1).png" alt="Auf die Plätze! Citizen Science in deiner Stadt."></img>
            </a>
            <a href="https://www.wissenschaft-im-dialog.de/" target="_blank">
                <img className="wid-logo" src="/images/01_LOGO_WID-rgb.png" alt="Wissenschaft im Dialog"></img>
            </a>
            <a href="https://www.museumfuernaturkunde.berlin/de" target="_blank">
                <img className="cl-logo" src="/images/02_mfn_logo_STANDARD_auf_weiss-kl.png" alt="Museum für Naturkunde Berlin/ Leibniz-Institut für Evolutions- und Biodiversitätsforschung"></img>
            </a>

        </div>
        <div className="image-row">
            <a href="https://www.buergerschaffenwissen.de/" target="_blank">
                <img className="cl-logo" src="/images/BsW_Logo-m-Claim-WEB-kl.png" alt="Bürger schaffen Wissen"></img>
            </a>
            <a href="https://www.bmbf.de/" target="_blank">
                <img className="cl-logo" src="/images/BMBF_gefoerdert_vom_deutsch_CMYK.png" alt="Bundesministerium für Bildung und Forschung"></img>
            </a>
            <a href="https://www.bmbf.de/bmbf/de/ueber-uns/wissenschaftskommunikation-und-buergerbeteiligung/buergerbeteiligung/citizen-science/buergerforschung.html" target="_blank">
                <img className="cl-logo" src="/images/BForschung_Logo_web-kl.png" alt="Bürgerforschung Wissenschaft für alle"></img>
            </a>
        </div>
     </form>
    );
};
const WelcomeContainer = withCopyEdit(WelcomeView);

export default WelcomeContainer;
