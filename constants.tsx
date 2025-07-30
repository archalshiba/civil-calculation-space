
import { HomeIcon, CalculatorIcon, FolderIcon, DocumentReportIcon, QuestionMarkCircleIcon } from './components/icons/Icons';
import type { NavItem, CalculatorSection } from './types';
import ColumnCalculatorModal from './components/calculators/ColumnCalculatorModal';
import CircularColumnCalculatorModal from './components/calculators/CircularColumnCalculatorModal';
import BeamCalculatorModal from './components/calculators/BeamCalculatorModal';
import TBeamCalculatorModal from './components/calculators/TBeamCalculatorModal';
import SlabCalculatorModal from './components/calculators/SlabCalculatorModal';
import TwoWaySlabCalculatorModal from './components/calculators/TwoWaySlabCalculatorModal';
import IsolatedFootingCalculatorModal from './components/calculators/IsolatedFootingCalculatorModal';
import CombinedFootingCalculatorModal from './components/calculators/CombinedFootingCalculatorModal';
import StripFootingCalculatorModal from './components/calculators/StripFootingCalculatorModal';
import PileCapFoundationModal from './components/calculators/PileCapFoundationModal';
import WallCalculatorModal from './components/calculators/WallCalculatorModal';
import RetainingWallCalculatorModal from './components/calculators/RetainingWallCalculatorModal';
import DiaphragmCalculatorModal from './components/calculators/DiaphragmCalculatorModal';
import BracketCorbelCalculatorModal from './components/calculators/BracketCorbelCalculatorModal';
import BeamColumnJointCalculatorModal from './components/calculators/BeamColumnJointCalculatorModal';
import AnchorageCalculatorModal from './components/calculators/AnchorageCalculatorModal';
import PlaceholderCalculatorModal from './components/calculators/PlaceholderCalculatorModal';

export const NAV_ITEMS: NavItem[] = [
  { nameKey: 'nav.home', path: '/', icon: HomeIcon },
  { nameKey: 'nav.calculators', path: '/calculators', icon: CalculatorIcon },
  { nameKey: 'nav.projects', path: '/projects', icon: FolderIcon },
  { nameKey: 'nav.reports', path: '/reports', icon: DocumentReportIcon },
  { nameKey: 'nav.help', path: '/help', icon: QuestionMarkCircleIcon },
];

export const CALCULATORS_DATA: CalculatorSection[] = [
  {
    titleKey: 'calculators.sections.columns',
    calculators: [
      { id: 'col-rect', titleKey: 'calculators.columns.rect.title', descriptionKey: 'calculators.columns.rect.description', modalComponent: ColumnCalculatorModal },
      { id: 'col-circ', titleKey: 'calculators.columns.circ.title', descriptionKey: 'calculators.columns.circ.description', modalComponent: CircularColumnCalculatorModal },
      { id: 'col-other', titleKey: 'calculators.columns.other.title', descriptionKey: 'calculators.columns.other.description', modalComponent: PlaceholderCalculatorModal },
    ],
  },
  {
    titleKey: 'calculators.sections.beams',
    calculators: [
      { id: 'beam-rect', titleKey: 'calculators.beams.rect.title', descriptionKey: 'calculators.beams.rect.description', modalComponent: BeamCalculatorModal },
      { id: 'beam-t', titleKey: 'calculators.beams.t.title', descriptionKey: 'calculators.beams.t.description', modalComponent: TBeamCalculatorModal },
      { id: 'beam-cantilever', titleKey: 'calculators.beams.cantilever.title', descriptionKey: 'calculators.beams.cantilever.description', modalComponent: PlaceholderCalculatorModal },
    ],
  },
  {
    titleKey: 'calculators.sections.slabs',
    calculators: [
        { id: 'slab-oneway', titleKey: 'calculators.slabs.oneway.title', descriptionKey: 'calculators.slabs.oneway.description', modalComponent: SlabCalculatorModal },
        { id: 'slab-twoway', titleKey: 'calculators.slabs.twoway.title', descriptionKey: 'calculators.slabs.twoway.description', modalComponent: TwoWaySlabCalculatorModal },
        { id: 'slab-flat', titleKey: 'calculators.slabs.flat.title', descriptionKey: 'calculators.slabs.flat.description', modalComponent: PlaceholderCalculatorModal },
    ],
  },
  {
    titleKey: 'calculators.sections.foundations',
    calculators: [
        { id: 'found-iso', titleKey: 'calculators.foundations.iso.title', descriptionKey: 'calculators.foundations.iso.description', modalComponent: IsolatedFootingCalculatorModal },
        { id: 'found-comb', titleKey: 'calculators.foundations.comb.title', descriptionKey: 'calculators.foundations.comb.description', modalComponent: CombinedFootingCalculatorModal },
        { id: 'found-strip', titleKey: 'calculators.foundations.strip.title', descriptionKey: 'calculators.foundations.strip.description', modalComponent: StripFootingCalculatorModal },
        { id: 'found-mat', titleKey: 'calculators.foundations.mat.title', descriptionKey: 'calculators.foundations.mat.description', modalComponent: PlaceholderCalculatorModal },
        { id: 'found-pile', titleKey: 'calculators.foundations.pile.title', descriptionKey: 'calculators.foundations.pile.description', modalComponent: PileCapFoundationModal },
    ],
  },
    {
    titleKey: 'calculators.sections.walls',
    calculators: [
        { id: 'wall-rect', titleKey: 'calculators.walls.rect.title', descriptionKey: 'calculators.walls.rect.description', modalComponent: WallCalculatorModal },
        { id: 'wall-retaining', titleKey: 'calculators.walls.retaining.title', descriptionKey: 'calculators.walls.retaining.description', modalComponent: RetainingWallCalculatorModal },
        { id: 'wall-circ', titleKey: 'calculators.walls.circ.title', descriptionKey: 'calculators.walls.circ.description', modalComponent: PlaceholderCalculatorModal },
        { id: 'wall-shear', titleKey: 'calculators.walls.shear.title', descriptionKey: 'calculators.walls.shear.description', modalComponent: PlaceholderCalculatorModal },
    ],
  },
  {
    titleKey: 'calculators.sections.diaphragms',
    calculators: [
        { id: 'diaphragm', titleKey: 'calculators.diaphragms.diaphragm.title', descriptionKey: 'calculators.diaphragms.diaphragm.description', modalComponent: DiaphragmCalculatorModal },
    ],
  },
  {
    titleKey: 'calculators.sections.brackets',
    calculators: [
        { id: 'bracket-corbel', titleKey: 'calculators.brackets.corbel.title', descriptionKey: 'calculators.brackets.corbel.description', modalComponent: BracketCorbelCalculatorModal },
    ],
  },
  {
    titleKey: 'calculators.sections.joints',
    calculators: [
        { id: 'joint-beam-col', titleKey: 'calculators.joints.beamCol.title', descriptionKey: 'calculators.joints.beamCol.description', modalComponent: BeamColumnJointCalculatorModal },
        { id: 'joint-anchorage', titleKey: 'calculators.joints.anchorage.title', descriptionKey: 'calculators.joints.anchorage.description', modalComponent: AnchorageCalculatorModal },
    ],
  },
];
