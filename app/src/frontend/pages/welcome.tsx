import React from 'react';
import { Link } from 'react-router-dom';

import { CCConfig } from '../../cc-config';
let config: CCConfig = require('../../cc-config.json')

import Categories from '../building/categories';
import './welcome.css';

const Welcome = () => (
    <div className="section-body welcome">
        <Categories mode="view"/>
        <h1 className="h2">Willkommen bei Colouring {config.cityName}!</h1>
        <p>

            Colouring {config.cityName} ist eine offene Wissensplattform, entwickelt um über 50 Merkmale zu Gebäuden in der Stadt zu erfassen und als offene Datenbereitzustellen.
            Mit dem Ziel die Stadt nachhaltiger und resilienter zu gestalten.

        </p>
        <p>
            Colouring Dresden ist Teil des internationalen Forschungsnetzwerkes Colouring Cities Research Programme (CCRP), welches
            am Alan Turing Institut angesiedelt ist (dem nationalen Institut des Vereinigten Königreichs für Data Science und künstliche Intelligenz). 
            Das Forschungsnetzwerk arbeitet mit lokalen, regionalen, nationalen und internationalen Partnern an der Weiterentwicklung des offenen Programmcodes, 
            und kann auf weitere Städte übertragen werden.
        </p>
        <p>
            Neue Datensätze oder Funktionen werden kontinuierlich ergänzt. Über Ihre Mitwirkung bei der Erfassung oder Verifikation von Gebäudemerkmalen sind wir dankbar!
        </p>
        <p>
            All our <Link to="/data-extracts.html">data</Link> and <a href="https://github.com/colouring-cities/colouring-core">code</a> are 
            free to download, use and share under our open licence terms. 
            Our <a href="https://github.com/colouring-cities/manual/wiki">open manual</a> provides detailed
            non-technical information on the CCRP, and our international collaborators, 
            for anyone interested in our research.
        </p>
        <Link to="/view/categories"
            className="btn btn-outline-dark btn-lg btn-block">
            Let´s colour {config.cityName}!
        </Link>
        <div className="image-row">
            <img className="cl-logo" src="images/logo-cc.jpg" alt="Colouring Cities Research Programme"></img>
            <img className="turing-logo" src="images/logo-turing.jpg" alt="Alan Turing Institute"></img>
        </div>
        <div className="image-row">
            <img src="images/supporter-logos.png" alt="Colouring Cities collaborating organisations: The Bartlett UCL, Ordnance Survey, Historic England, Greater London Authority" />
        </div>
        <div className="image-row">
            <img src="images/logo-loughborough.png" alt="Colouring Cities collaborating organisations: Loughborough University" />
            <img src="images/logo-newcastle.png" alt="Colouring Cities collaborating organisations: Newcastle University" />
        </div>
    </div>
);

export default Welcome;
