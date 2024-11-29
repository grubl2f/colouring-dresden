import React from 'react'
import { Category } from './categories-config'

import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import {
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
  WelcomeIcon,
} from '../components/icons'

export const categoriesIcons: {[key in Category]: React.FC<FontAwesomeIconProps>} = {
  [Category.Location      ]: LocationIcon,
  [Category.LandUse       ]: LandUseIcon,
  [Category.Type          ]: TypeIcon,
  [Category.Size          ]: SizeIcon,
  [Category.Construction  ]: ConstructionIcon,
  [Category.Age           ]: AgeIcon,
  [Category.Streetscape   ]: StreetscapeIcon,
  [Category.Team          ]: TeamIcon,
  [Category.Planning      ]: PlanningIcon,
  [Category.Sustainability]: SustainabilityIcon,
  [Category.Resilience    ]: ResilienceIcon,
  [Category.Community     ]: CommunityIcon,
  [Category.Welcome       ]: WelcomeIcon,
}