import React from 'react';

import '../../map/map-button.css';
import withCopyEdit from '../data-container';
import UserOpinionEntry from '../data-components/user-opinion-data-entry';
import { MultiSelectDataEntry } from '../data-components/multi-select-data-entry';
import { DataEntryGroup } from '../data-components/data-entry-group';

import { CategoryViewProps } from './category-view-props';
import InfoBox from '../../components/info-box';
import { LogicalDataEntry, LogicalDataEntryYesOnlyWithExplanation } from '../data-components/logical-data-entry/logical-data-entry';
import { buildingUserFields, dataFields } from '../../config/data-fields-config';

import './community.css';
import SelectDataEntry from '../data-components/select-data-entry';
import Verification from '../data-components/verification';
import { MultiDataEntry } from '../data-components/multi-data-entry/multi-data-entry';
import { useDisplayPreferences } from '../../displayPreferences-context';

/**
* Community view/edit section
*/
const CommunityView: React.FunctionComponent<CategoryViewProps> = (props) => {
    const switchToTypologyMapStyle = (e) => {
        e.preventDefault();
        props.onMapColourScale('typology_likes')
    }
    const switchToLocalSignificanceMapStyle = (e) => {
        e.preventDefault();
        props.onMapColourScale('community_local_significance_total')
    }
   const switchToExpectedApplicationMapStyle = (e) => {
        e.preventDefault();
        props.onMapColourScale('community_expected_planning_application_total')
    }
    const switchToPublicOwnershipMapStyle = (e) => {
        e.preventDefault();
        props.onMapColourScale('community_in_public_ownership')
    }
    const { darkLightTheme } = useDisplayPreferences();
    const worthKeepingReasonsNonEmpty = Object.values(props.building.community_type_worth_keeping_reasons ?? {}).some(x => x);
    return <>

        <InfoBox>
            Dieser Abschnitt ist noch in der Entwicklung.
        </InfoBox>
{/*         <DataEntryGroup name="Sichtweise der Community auf Gebäudetypen" collapsed={false} >
        <div className='community-opinion-pane'>
            <InfoBox>
                Hier wird Ihre Einschätzung erfasst, wie gut Sie bestimmte Gebäudetypen (und nicht einzelne Gebäude) finden, um sicherzustellen, dass wir als Gesellschaft alle nützlichen Gebäude retten und wiederverwenden können, und um die Qualität der Stadtgestaltung in Zukunft zu verbessern.
           </InfoBox> */}
            {
            /*
            {(props.building.is_domestic === "no" || props.building.is_domestic === "mixed domestic/non-domestic") ?
            <>
                <UserOpinionEntry
                    slug='community_like'
                    title={buildingUserFields.community_like.title}

                    userValue={props.building.community_like}

                    onChange={props.onSaveChange}
                    mode={props.mode}
                    copy={props.copy}
                />
                <button className={`map-switcher-inline ${props.mapColourScale == "likes" ? "enabled-state" : "disabled-state"} btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToLikesMapStyle}>
                    {(props.mapColourScale == "likes")? 'Showing likes for specific buildings' : 'Click to see likes for specific buildings mapped'}
                </button>
                </>
            : <></>}
            */
            }
{/*             <LogicalDataEntryYesOnlyWithExplanation
                slug='community_type_worth_keeping'
                title={buildingUserFields.community_type_worth_keeping.title}

                value={props.building.community_type_worth_keeping}
                disallowFalse={worthKeepingReasonsNonEmpty}
                disallowNull={worthKeepingReasonsNonEmpty}

                onChange={props.onSaveChange}
                mode={props.mode}

            />
            {
                props.building.community_type_worth_keeping === true &&
                <MultiSelectDataEntry
                    slug='community_type_worth_keeping_reasons'
                    title={buildingUserFields.community_type_worth_keeping_reasons.title}
                    value={props.building.community_type_worth_keeping_reasons}
                    disabled={!props.building.community_type_worth_keeping}
                    onChange={props.onSaveChange}
                    options={
                        Object.entries(buildingUserFields.community_type_worth_keeping_reasons.fields)
                        .map(([key, definition]) => ({
                            key,
                            label: definition.title
                        }))
                    }
                    
                    mode={props.mode}
                />
            } */}
            {
            /*
            <button className={`map-switcher-inline ${props.mapColourScale == "typology_likes" ? "enabled-state" : "disabled-state"} btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToTypologyMapStyle}>
                {(props.mapColourScale == "typology_likes")? 'Showing likes for typologies (not about specific buildings)' : 'Click to see views on building typologies'}
            </button>
            */
            }
            {/* <hr />
            

            <UserOpinionEntry
                slug='community_local_significance'
                title={buildingUserFields.community_local_significance.title}
                
                userValue={props.building.community_local_significance}

                onChange={props.onSaveChange}
                mode={props.mode}
                copy={props.copy}
            />
            {(props.mapColourScale == "community_local_significance_total") ? 
            <button className={`map-switcher-inline enabled-state btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToTypologyMapStyle}>
            {'Zurück zur Kartendarstellung zu Likes von Typologien.'}
        </button>
            :
            <button className={`map-switcher-inline disabled-state btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToLocalSignificanceMapStyle}>
            {"Ändern der Kartendarstellung auf Gebäude von lokalem Interesse."}
            </button>
            }

            <hr />
            <UserOpinionEntry
                slug='community_expected_planning_application'
                title={buildingUserFields.community_expected_planning_application.title}
                
                userValue={props.building.community_expected_planning_application}

                onChange={props.onSaveChange}
                mode={props.mode}
                copy={props.copy}
            />
            {(props.mapColourScale == "community_expected_planning_application_total") ? 
            <button className={`map-switcher-inline enabled-state btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToTypologyMapStyle}>
            {'Zurück zur Kartendarstellung zu Likes von Typologien.'}
        </button>
            :
            <button className={`map-switcher-inline disabled-state btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToExpectedApplicationMapStyle}>
            {"Click here to change map to planning applications expected by community."}
            </button>
            }


        </div>
        </DataEntryGroup>
        <DataEntryGroup name="Gebäudenutzung für Gemeinschaftsaktivitäten" collapsed={false} >
        <InfoBox>
            Hier erfassen wir Informationen über den Standort von Gebäuden, die für Gemeinschaftsaktivitäten genutzt werden, damit wir den Verlust bzw. die Erweiterung von Gemeinschaftsräumen im Laufe der Zeit verfolgen können.
        </InfoBox>
        <LogicalDataEntry
            slug='community_activities_current'
            title={dataFields.community_activities_current.title}
            tooltip={dataFields.community_activities_current.tooltip}
            value={props.building.community_activities_current}
            copy={props.copy}
            onChange={props.onChange}
            mode={props.mode}
        />
        <LogicalDataEntry
            slug='community_activities'
            title={dataFields.community_activities.title}
            tooltip={dataFields.community_activities.tooltip}
            value={props.building.community_activities}
            copy={props.copy}
            onChange={props.onChange}
            mode={props.mode}
        />
        <LogicalDataEntry
            slug='community_activities_always'
            title={dataFields.community_activities_always.title}
            tooltip={dataFields.community_activities_always.tooltip}
            value={props.building.community_activities_always}
            copy={props.copy}
            onChange={props.onChange}
            mode={props.mode}
        /> */}
        {/* TODO: dates */}
        {
            // props.building.community_activities === true &&
            // <FieldRow>
            //     <div>
            //     </div>
            //     <div>
            //     </div>
            // </FieldRow>
        }
        
        {/* <SelectDataEntry
            slug='community_public_ownership'
            title={dataFields.community_public_ownership.title}
            value={props.building.community_public_ownership}
            options={[
                'Government-owned',
                'Charity-owned',
                'Community-owned/cooperative',
                'Owned by other non-profit body',
                'Not in public/community ownership',
            ]}

            onChange={props.onChange}
            mode={props.mode}
            copy={props.copy}
        />
        <Verification
                slug="community_public_ownership"
                allow_verify={props.user !== undefined && props.building.community_public_ownership !== null && !props.edited}
                onVerify={props.onVerify}
                user_verified={props.user_verified.hasOwnProperty("community_public_ownership")}
                user_verified_as={props.user_verified.community_public_ownership}
                verified_count={props.building.verified?.community_public_ownership}
                />
        <MultiDataEntry
            slug='community_public_ownership_sources'
            title={dataFields.community_public_ownership_sources.title}
            isUrl={true}
            placeholder={'https://...'}
            editableEntries={true}
            value={props.building.community_public_ownership_sources}
            onChange={props.onChange}
            mode={props.mode}
            copy={props.copy}
        />
        <Verification
                slug="community_public_ownership_sources"
                allow_verify={props.user !== undefined && props.building.community_public_ownership_sources !== null && !props.edited}
                onVerify={props.onVerify}
                user_verified={props.user_verified.hasOwnProperty("community_public_ownership_sources")}
                user_verified_as={props.user_verified.community_public_ownership_sources}
                verified_count={props.building.verified?.community_public_ownership_sources}
                /> */}


{/*         {(props.mapColourScale == "community_in_public_ownership") ? 
        <button className={`map-switcher-inline enabled-state btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToTypologyMapStyle}>
        {'Click to return to liked typologies mapped.'}
    </button>
        :
        <button className={`map-switcher-inline disabled-state btn btn-outline btn-outline-dark ${darkLightTheme}`} onClick={switchToPublicOwnershipMapStyle}>
        {"Click here to see ownership type mapped."}
        </button>
        } */}


{/*         </DataEntryGroup>*/}
    </> 
};
const CommunityContainer = withCopyEdit(CommunityView);

export default CommunityContainer;
