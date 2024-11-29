import React from 'react';

/**
 * Mini-library of icons
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faAngleLeft,
    faAngleRight,
    faCaretDown,
    faCaretLeft,
    faCaretRight,
    faCaretUp,
    faCheck,
    faCheckCircle,
    faCheckDouble,
    faEye,
    faInfo,
    faInfoCircle,
    faEdit,
    faQuestionCircle,
    faSearch,
    faSpinner,
    faTimes,

    /*******************
     * Categories Icons
     *******************/
    // faAlignJustify,
    // faArrowsAltV,
    faCalendarCheck,
    // faCity,
    faComments,
    // faHardHat,
    faHourglassHalf,
    // faIndustry,
    // faLocationArrow,
    // faMapMarked,
    faMapMarkedAlt,
    faMapSigns,
    // faPaintRoller,
    // faQuestion,
    faLightbulb,
    faRulerCombined,
    faShapes,
    faSyncAlt,
    // faTree,
    faUsers,
    faHammer,
    faRecycle,
    // faTools,
    // faCog,
    // faCogs,
    faBuilding,
    // faListAlt,
    // faFolderPlus,
    // faFolderOpen,
    // faPlus,
    // faPlusSquare,
    // faScroll,
    // faStarOfLife,
    // faTh,
    // faThLarge,
    // faUniversity,
    // faWrench,
    // faFile,
    // faFileAlt,
    // faEdit,

    /*******************
     * Category Header Action Icons
     *******************/
    faHistory,
    faCopy,

    faCopyright,
    faList,

    faAngleUp,
    faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(
    faQuestionCircle,
    faInfo,
    faInfoCircle,
    faEdit,
    faTimes,
    faCheck,
    faCheckCircle,
    faCheckDouble,
    faAngleLeft,
    faAngleRight,
    faCaretDown,
    faCaretUp,
    faCaretLeft,
    faCaretRight,
    faSearch,
    faEye,
    faSpinner,

    /*******************
     * Categories Icons
     *******************/
    faMapMarkedAlt,
    faBuilding, // faTools, // faIndustry,
    faShapes,
    faRulerCombined,
    faHammer, // faWrench, // faHardHat,
    faHourglassHalf, // faUniversity,
    faMapSigns, // faTree,
    faUsers,
    faCalendarCheck,
    faLightbulb,
    faRecycle, // faSyncAlt,
    faComments,

    /*******************
     * Category Header Action Icons
     *******************/
    faHistory,
    faCopy,

    faCopyright,
    faList,

    faAngleUp,
    faAngleDown,
);

const HelpIcon = () => (
    <FontAwesomeIcon icon="question-circle" />
);

const InfoIcon = () => (
    <FontAwesomeIcon icon="info-circle" />
);

const InfoIconSimple = () => (
    <FontAwesomeIcon icon="info" />
);

const EditIcon = () => (
    <FontAwesomeIcon icon="edit" />
);

const ViewIcon = () => (
    <FontAwesomeIcon icon="eye" />
);

const CloseIcon = () => (
    <FontAwesomeIcon icon="times" />
);

const SaveIcon = () => (
    <FontAwesomeIcon icon="check" />
);

const SaveDoneIcon = () => (
    <FontAwesomeIcon icon="check-double" />
);

const VerifyIcon = () => (
    <FontAwesomeIcon icon="check-circle" />
)

const BackIcon: React.FC = () => (
    // <FontAwesomeIcon icon="angle-left" />
    <FontAwesomeIcon icon={faAngleLeft} />
);

const ForwardIcon: React.FC = () => (
    // <FontAwesomeIcon icon="angle-right" />
    <FontAwesomeIcon icon={faAngleRight} />
);

const DownIcon: React.FC = () => (
    // <FontAwesomeIcon icon="caret-down" />
    <FontAwesomeIcon icon={faCaretDown} />
);

const UpIcon: React.FC = () => (
    // <FontAwesomeIcon icon="caret-up" />
    <FontAwesomeIcon icon={faCaretUp} />
);

const LeftIcon: React.FC = () => (
    // <FontAwesomeIcon icon="caret-left" />
    <FontAwesomeIcon icon={faCaretLeft} />
);

const RightIcon: React.FC = () => (
    // <FontAwesomeIcon icon="caret-right" />
    <FontAwesomeIcon icon={faCaretRight} />
);

const SearchIcon = () => (
    <FontAwesomeIcon icon="search" />
);

const SpinnerIcon: React.FC<{spin?: boolean}> = ({spin=true}) => (
    <FontAwesomeIcon icon="spinner" spin={spin} />
);

/*******************
 * Categories Icons
 *******************/
const LocationIcon = () => <FontAwesomeIcon icon="map-marked-alt" />
const LandUseIcon = () => <FontAwesomeIcon icon="building" />
const TypeIcon = () => <FontAwesomeIcon icon="shapes" />
const SizeIcon = () => <FontAwesomeIcon icon="ruler-combined" />
const ConstructionIcon = () => <FontAwesomeIcon icon="hammer" />
const AgeIcon = () => <FontAwesomeIcon icon="hourglass-half" />
const StreetscapeIcon = () => <FontAwesomeIcon icon="map-signs" />
const TeamIcon = () => <FontAwesomeIcon icon="users" />
const PlanningIcon = () => <FontAwesomeIcon icon="calendar-check" />
const SustainabilityIcon = () => <FontAwesomeIcon icon="lightbulb" />
const ResilienceIcon = () => <FontAwesomeIcon icon="recycle" />
const CommunityIcon = () => <FontAwesomeIcon icon="comments" />

/*******************
 * Category Header Action Icons
 *******************/
const EditHistoryIcon = () => <FontAwesomeIcon icon="history" />
const CopyIcon = () => <FontAwesomeIcon icon="copy" />

const CopyrightIcon = () => <FontAwesomeIcon icon="copyright" />
const LegendIcon = () => <FontAwesomeIcon icon="list" />

// const ForwardUpIcon = () => <FontAwesomeIcon icon="angle-up" />
// const BackDownIcon = () => <FontAwesomeIcon icon="angle-down" />
// const ForwardUpIcon: React.FC = () => <FontAwesomeIcon icon="caret-up" />
// const BackDownIcon: React.FC = () => <FontAwesomeIcon icon="caret-down" />
const ForwardUpIcon: React.FC = () => <FontAwesomeIcon icon={faCaretUp} />
const BackDownIcon: React.FC = () => <FontAwesomeIcon icon={faCaretDown} />



export {
    HelpIcon,
    InfoIcon,
    InfoIconSimple,
    EditIcon,
    ViewIcon,
    CloseIcon,
    SaveIcon,
    SaveDoneIcon,
    BackIcon,
    ForwardIcon,
    DownIcon,
    UpIcon,
    RightIcon,
    LeftIcon,
    SearchIcon,
    VerifyIcon,
    SpinnerIcon,

    /*******************
     * Categories Icons
     *******************/
    LocationIcon,
    LandUseIcon,
    TypeIcon,
    SizeIcon,
    ConstructionIcon,
    AgeIcon,
    StreetscapeIcon,
    TeamIcon,
    PlanningIcon,
    SustainabilityIcon,
    ResilienceIcon,
    CommunityIcon,
    InfoIconSimple as WelcomeIcon,

    /*******************
     * Category Header Action Icons
     *******************/
    EditHistoryIcon,
    CopyIcon,

    CopyrightIcon,
    LegendIcon,

    ForwardUpIcon,
    BackDownIcon,
};
