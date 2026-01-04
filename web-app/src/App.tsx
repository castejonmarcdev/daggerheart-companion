import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import {
  HomePage,
  ClassesPage,
  ClassDetailPage,
  AncestriesPage,
  AncestryDetailPage,
  CommunitiesPage,
  CommunityDetailPage,
  DomainsPage,
  DomainDetailPage,
  WeaponsPage,
  WeaponDetailPage,
  ArmorPage,
  ArmorDetailPage,
  MechanicsPage,
  MechanicDetailPage,
  MechanicsByCategoryPage,
  GuideDetailPage,
  SearchResultsPage,
  CharacterCreatorPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="classes/:slug" element={<ClassDetailPage />} />
          <Route path="ancestries" element={<AncestriesPage />} />
          <Route path="ancestries/:slug" element={<AncestryDetailPage />} />
          <Route path="communities" element={<CommunitiesPage />} />
          <Route path="communities/:slug" element={<CommunityDetailPage />} />
          <Route path="domains" element={<DomainsPage />} />
          <Route path="domains/:slug" element={<DomainDetailPage />} />
          <Route path="equipment/weapons" element={<WeaponsPage />} />
          <Route path="equipment/weapons/:slug" element={<WeaponDetailPage />} />
          <Route path="equipment/armor" element={<ArmorPage />} />
          <Route path="equipment/armor/:slug" element={<ArmorDetailPage />} />
          <Route path="mechanics" element={<MechanicsPage />} />
          <Route path="mechanics/category/:category" element={<MechanicsByCategoryPage />} />
          <Route path="mechanics/:slug" element={<MechanicDetailPage />} />
          <Route path="guides/:slug" element={<GuideDetailPage />} />
          <Route path="tools/character-creator" element={<CharacterCreatorPage />} />
          <Route path="search" element={<SearchResultsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
