import React, { Fragment, useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import Confetti from 'canvas-confetti';
import _ from 'lodash';

import { apiPost, apiGet } from '../apiHelpers';
import { sendBuildingUpdate } from '../api-data/building-update';
import ErrorBox from '../components/error-box';
import InfoBox from '../components/info-box';
import { compareObjects } from '../helpers';
import { Building, BuildingEdits, BuildingUserAttributes, UserVerified } from '../models/building';
import { BuildingMapTileset } from '../config/tileserver-config';
import { User } from '../models/user';

import ContainerHeader from './container-header';
import { CategoryViewProps, CopyProps } from './data-containers/category-view-props';
import { CopyControl } from './header-buttons/copy-control';
import { ViewEditControl } from './header-buttons/view-edit-control';

import './data-container.css';
import { dataFields } from '../config/data-fields-config'

import { EditHistoryLatest } from './edit-history/edit-history-latest';

import {
    InfoIconSimple,
    InfoIcon,
    EditHistoryIcon,
} from '../components/icons';

import SurveyModal from '../components/survey-modal';

import { CCConfig } from '../../cc-config';
import config from '../../cc-config.json';


import { Category } from '../config/categories-config';

import { useIsSsr } from '../hooks/use-is-ssr'
import { useViewSize } from '../hooks/use-view-size'

//import L from 'leaflet';

interface DataContainerProps {
    title: string;
    cat: string;
    intro: string;
    help: string;
    inactive?: boolean;

    user?: User;
    mode: 'view' | 'edit';
    building?: Building;
    user_verified?: unknown;
    onBuildingUpdate: (buildingId: number, updatedData: Building) => void;
    onUserVerifiedUpdate: (buildingId: number, updatedData: UserVerified) => void;

    mapColourScale: BuildingMapTileset;
    onMapColourScale: (x: BuildingMapTileset) => void;

    collapsed?: boolean;
    setCollapsed?: (h: number) => void;
    onMoveHeader?: (dX: number, dY: number) => void;
    contentHeight?: number;
}

interface DataContainerState {
    error: string;
    copying: boolean;
    keys_to_copy: {[key: string]: boolean};
    currentBuildingId: number;
    currentBuildingRevisionId: number;
    buildingEdits: BuildingEdits;
    mapColourScale: BuildingMapTileset;
    onMapColourScale: (x: BuildingMapTileset) => void;
    setShowSurveyModal: boolean;

    height: number,
    isDragging: boolean,
    startY: number,
    startHeight: number,
}

const getDefaultHeight = (h: number): number => {
    if (h === undefined) return 300;
    return Math.min(300, screen.height * 0.5)
}

export type DataContainerType = React.ComponentType<DataContainerProps>;

/**
 * Shared functionality for view/edit forms
 *
 * See React Higher-order-component docs for the pattern
 * - https://reactjs.org/docs/higher-order-components.html
 *
 * @param WrappedComponent
 */
const withCopyEditFc = (WrappedComponent: React.ComponentType<CategoryViewProps>): React.FC<DataContainerProps> => {

    const DataContainer: React.FC<DataContainerProps> = (props) => {
        const isSsr = useIsSsr()
        const screen = useViewSize()

        // DataContainerState
        const [error, setError] = useState<Error | undefined>(undefined)
        const [copying, setCopying] = useState<boolean>(false)
        const [keys_to_copy, setKeys_to_copy] = useState({})
        const [buildingEdits, setBuildingEdits] = useState({})
        const [currentBuildingId, setCurrentBuildingId] = useState(undefined)
        const [currentBuildingRevisionId, setCurrentBuildingRevisionId] = useState(undefined)
        const mapColourScale = props.mapColourScale
        const onMapColourScale = props.onMapColourScale
        const [setShowSurveyModal, setSetShowSurveyModal] = useState(false)
        
        useEffect(() => {
            const newBuildingId = props.building == undefined ? undefined : props.building.building_id;
            const newBuildingRevisionId = props.building == undefined ? undefined : props.building.revision_id;

            const categoryKeys = {};
            const blackListedKeys = [
                'current_landuse_order',
                'current_landuse_verified',
                'planning_list_grade',
                'likes_total',
                'community_type_worth_keeping_total',
                'community_local_significance_total',
                'community_expected_planning_application_total',
                'thermal_stress_objective',
                'thermal_stress_subjective',
                'direction_of_windows',
                'heat_adaption_measure',
                'rain_flood_preventive_measures1',
                'rain_flood_preventive_measures2',
                'rain_flood_preventive_measures3',
                'rain_flood_historic_incidents',
                'size_height_apex',
                'location_number',
                'location_street',
                'location_town',
                'location_postcode',
                'ref_toid',
                'ref_osm_id',
                'ref_osm_type',
                'ref_land_parcel',
                'location_latitude',
                'location_longitude',
                'planning_data'
            ]
            for (const key in dataFields) {  
                const fieldName = props.building == undefined ? undefined : props.building[key];    
                if (dataFields[key].category == props.cat && fieldName != null && !blackListedKeys.includes(key)){
                    categoryKeys[key] = true;
                }
                if (props.cat == 'team' && key == 'date_year' && fieldName != null && !blackListedKeys.includes(key)){
                    categoryKeys[key] = true;
                }
            }

            if(newBuildingId !== currentBuildingId || newBuildingRevisionId > currentBuildingRevisionId) {
                setError(undefined)
                setCopying(false)
                setKeys_to_copy(categoryKeys)
                setBuildingEdits({})
                setCurrentBuildingId(newBuildingId)
                setCurrentBuildingRevisionId(newBuildingRevisionId)
                setSetShowSurveyModal(false)
            }

        }, [
            props.building,
            props.cat,
            currentBuildingId,
            currentBuildingRevisionId,
        ])


        // handlers
        /**
         * Enter or exit "copying" state - allow user to select attributes to copy
         */
        const toggleCopying = useCallback(() => {
            setCopying((prevCopying) => !prevCopying)
        }, [
            // setCopying,
        ])

        /**
         * Keep track of data to copy (accumulate while in "copying" state)
         *
         * @param {string} key
         */
        const toggleCopyAttribute = useCallback((key: string) => {
            const keys = {...keys_to_copy}
            if(keys_to_copy[key]){
                delete keys[key];
            } else {
                keys[key] = true;
            }
            setKeys_to_copy(keys)
        }, [
            keys_to_copy,
        ])

        const isEdited = useCallback(() => {
            return !_.isEmpty(buildingEdits);
        }, [
            buildingEdits,
        ])

        const clearEdits = useCallback(() => {
            setBuildingEdits({})
        }, [
        ])

        const getEditedBuilding = useCallback(() => {
            if(isEdited()) {
                return Object.assign({}, props.building, buildingEdits);
            } else {
                return {...props.building};
            }
        }, [
            props.building,
            buildingEdits,
            isEdited,
        ])

        const updateBuildingState = useCallback((key: string, value: unknown) => {
            const newBuilding = getEditedBuilding();
            newBuilding[key] = value;
            const [forwardPatch] = compareObjects(props.building, newBuilding);
            setBuildingEdits(forwardPatch)
        }, [
            props.building,
            getEditedBuilding,
        ])

        /**
         * Handle update directly
         * - e.g. as callback from MultiTextInput where we set a list of strings
         *
         * @param {String} name
         * @param {*} value
         */
        const handleChange = useCallback((name: string, value: unknown) => {
            updateBuildingState(name, value)
        }, [
            updateBuildingState,
        ])

        const handleReset = useCallback(() => {
            clearEdits()
        }, [
            clearEdits,
        ])

        const getSurveyPopUpStatus = useCallback(async (): Promise<void> => {
            /* depending on value in config file, API including SQL function will be triggered or not */
            if (config.enable_survey_popup == true){
                try {
                    const user = await apiGet('/api/users/get_survey_popup_status');
                    if (user.error) {
                        setSetShowSurveyModal(false)            
                    } else {
                        /* setUser(user); */
                        console.log(user[0].value);
                        /* convert API JSON response into boolean */
                        let bool_value = false
                        if ((user[0].value == "first") || (user[0].value == "second")){
                            bool_value = true;
                        }
                        /* var bool_value = user[0].value == "true" ? true : false; */
                        setSetShowSurveyModal(bool_value)
            
                    }
                } catch(err) {
                    /* setUserError('Error loading user info.'); */
                    setSetShowSurveyModal(false)            
                }
            }
        }, [
            config?.enable_survey_popup,
        ])

        const doSubmit = useCallback(async (edits: Partial<Building & BuildingUserAttributes>) => {
            setError(undefined)
            
            try {
                const buildingUpdate = await sendBuildingUpdate(props.building.building_id, edits);
                const updatedBuilding = Object.assign({}, props.building, buildingUpdate);
                props.onBuildingUpdate(props.building.building_id, updatedBuilding);

                /* trigger modal/popup show after saving changes */
                getSurveyPopUpStatus();
            } catch(error) {
                setError(error)
            }
        }, [
            props.building,
            props.building?.building_id,
            getSurveyPopUpStatus,
        ])

        const handleSubmit = useCallback(async (event) => {
            event.preventDefault();
            doSubmit(buildingEdits);
        }, [
            buildingEdits,
        ])

        const handleSaveAdd = useCallback(async (slug: string, newItem: unknown) => {
            if(props.building[slug] != undefined && !Array.isArray(props.building[slug])) {
                setError(new Error('Unexpected error'));
                console.error(new Error(`Sie versuchen ein neues Element dem Feld (${slug}) hinzuzufügen, welches keine Liste ist.`))
                return;
            }
            
            if(isEdited()) {
                setError(new Error('Neuer Eintrag kann nicht gespeichert werden, da noch ungespeicherte Änderungen existieren.'))
                return;
            }
            
            const edits = {
                [slug]: [...(props.building[slug] ?? []), newItem]
            };
            
            doSubmit(edits);
        }, [
            props.building,
        ])

        const handleSaveChange = useCallback(async (slug: string, value: unknown) => {
            if(isEdited()) {
                setError(new Error('Wert kann nicht geändert werden, solange es ungesicherte Änderungen gibt. Speichern oder verwerfen Sie die Änderungen zuerst.'));
                return;
            }

            const edits = {
                [slug]: value
            };

            doSubmit(edits);
        }, [
        ])

        const handleVerify = useCallback(async (slug: string, verify: boolean, x: number, y: number) => {
            const verifyPatch = {};
            if (verify) {
                verifyPatch[slug] = props.building[slug];
            } else {
                verifyPatch[slug] = null;
            }

            try {
                const data = await apiPost(
                    `/api/buildings/${props.building.building_id}/verify.json`,
                    verifyPatch
                );

                if (data.error) {
                    setError(data.error);
                } else {
                    if (verify) {
                        Confetti({
                            angle: 60,
                            disableForReducedMotion: true,
                            particleCount: 200,
                            ticks: 300,
                            origin: {x, y},
                            zIndex: 2000
                        });
                    }
                    props.onUserVerifiedUpdate(props.building.building_id, data);
                }
            } catch(err) {
                setError(err);
            }
            
            if (slug == 'current_landuse_group'){
                const edits = {
                    'current_landuse_verified': true
                };

                doSubmit(edits);
            }
            console.log(slug + " verify button clicked")
        }, [
            props.building,
            props.onUserVerifiedUpdate,
        ])

        const currentBuilding = getEditedBuilding();

        const values_to_copy = {};
        for (const key of Object.keys(keys_to_copy)) {
            values_to_copy[key] = currentBuilding[key];
        }
        const data_string = JSON.stringify(values_to_copy);
        const copy: CopyProps = {
            copying: copying,
            toggleCopying: toggleCopying,
            toggleCopyAttribute: toggleCopyAttribute,
            copyingKey: (key: string) => keys_to_copy[key]
        };

        const headerBackLink = `/${props.mode}/categories${props.building != undefined ? `/${props.building.building_id}` : ''}`;
        const edited = isEdited();
        const isDragging = useRef(false)
        const startY = useRef(0);
        const startHeight = useRef(0)

        return (
            <section
                id={props.cat}
                className="data-section"
            >
                <SurveyModal
                    show={setShowSurveyModal}
                    title="Umfrage"
                    description="Wir brauchen deine Rückmeldung! Nur mit dir können wir die Webseite verbessern und Gebäude in Dresden erforschen. Jede Stimme zählt."
                    confirmButtonText="Schließen"
                    confirmButtonClass="btn-secondary"
                    onConfirm={() => setSetShowSurveyModal(false)}
                    onCancel={() => setSetShowSurveyModal(false)}
                />
                <ContainerHeader
                    cat={props.cat}
                    title={props.title}
                    onMove={props.onMoveHeader}
                >
                {
                    props.help && !copy.copying?
                        <a
                            className="icon-button help"
                            title="Mehr erfahren"
                            href={props.help || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <InfoIcon />
                        </a>
                    : null
                }
                {
                    props.building != undefined && !props.inactive ?
                        <>
                            <CopyControl
                                cat={props.cat}
                                data_string={data_string}
                                copying={copy.copying}
                                toggleCopying={copy.toggleCopying}
                            />
                            {
                                !copy.copying ?
                                <>
                                    <NavLink
                                        className="icon-button history"
                                        to={`/${props.mode}/${props.cat}/${props.building.building_id}/history`}
                                    ><EditHistoryIcon /></NavLink>
                                    <ViewEditControl
                                        cat={props.cat}
                                        mode={props.mode}
                                        building={props.building}
                                    />
                                </>
                                :
                                null
                            }
                        </>
                    : null
                }
                </ContainerHeader>
                <div className="section-body"
                    style={(props.contentHeight !== undefined) ? {height: `${props.contentHeight}px`} : {}}
                >
                    <EditHistoryLatest
                        building={props.building}
                    />
                    {
                        props.inactive ?
                            <Fragment>
                                <WrappedComponent
                                    intro={props.intro}
                                    building={props.building}
                                    mode={props.mode}
                                    edited={false}
                                copy={copy}
                                onChange={undefined}
                                onVerify={undefined}
                                onSaveAdd={undefined}
                                onSaveChange={undefined}
                                user_verified={[]}
                                mapColourScale={undefined}
                                onMapColourScale={undefined}
                            />
                        </Fragment> :
                        (props.cat == Category.Welcome)
                            ? <WrappedComponent
                                    intro={props.intro}
                                    building={currentBuilding}
                                    mode={props.mode}
                                    edited={edited}
                                    copy={copy}
                                    onChange={handleChange}
                                    onVerify={handleVerify}
                                    onSaveAdd={handleSaveAdd}
                                    onSaveChange={handleSaveChange}
                                    user_verified={props.user_verified}
                                    user={props.user}
                                    mapColourScale={props.mapColourScale}
                                    onMapColourScale={props.onMapColourScale}
                                />
                            : (props.building != undefined)
                                ? <form
                                        action={`/edit/${props.cat}/${props.building.building_id}`}
                                        method="POST"
                                        onSubmit={handleSubmit}>
                                            {/* this disabled button prevents form submission on enter - see https://stackoverflow.com/a/51507806/1478817 */}
                                            <button type="submit" disabled style={{display: 'none'}}></button>
                                        {
                                            (props.mode === 'edit' && !props.inactive) ?
                                                <div className='edit-bar'>
                                                    <ErrorBox msg={error?.message} />
                                                    {
                                                        props.cat !== 'like' && // special-case for likes
                                                            <div className="buttons-container with-space">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                    disabled={!edited}
                                                                    aria-disabled={!edited}
                                                                >
                                                                    Änderungen speichern
                                                                </button>
                                                                {
                                                                    edited ?
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-warning"
                                                                            onClick={handleReset}
                                                                            >
                                                                            Änderungen verwerfen
                                                                        </button> :
                                                                        null
                                                                }
                                                            </div>
                                                    }
                                                </div>
                                                : null
                                        }
                                        <WrappedComponent
                                            intro={props.intro}
                                            building={currentBuilding}
                                            mode={props.mode}
                                            edited={edited}
                                            copy={copy}
                                            onChange={handleChange}
                                            onVerify={handleVerify}
                                            onSaveAdd={handleSaveAdd}
                                            onSaveChange={handleSaveChange}
                                            user_verified={props.user_verified}
                                            user={props.user}
                                            mapColourScale={props.mapColourScale}
                                            onMapColourScale={props.onMapColourScale}
                                        />
                                    </form>
                                : <InfoBox msg="Wählen Sie ein Gebäude aus um die Daten zu sehen."></InfoBox>
                }
                </div>
            </section>
        )
    }

    return DataContainer
}

export default withCopyEditFc;
