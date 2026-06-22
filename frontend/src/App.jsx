import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useAuthStore } from './store/authStore';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import SuggestionPage from './pages/SuggestionPage';
import EwastePage from './pages/EwastePage';
import LogPage from './pages/LogPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function StartPage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  return user && token ? <Navigate to="/home" replace /> : <LandingPage />;
}

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            border: '1px solid #E8E0F0',
            borderRadius: '14px',
            color: '#1A1A2E',
            boxShadow: '0 12px 34px rgba(155, 114, 207, 0.12)',
          },
          success: {
            iconTheme: { primary: '#52B788', secondary: '#FFFFFF' },
          },
          error: {
            iconTheme: { primary: '#E76F51', secondary: '#FFFFFF' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
        <Route path="/processing" element={<ProtectedRoute><ProcessingPage /></ProtectedRoute>} />
        <Route path="/results/:scanId" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/results/:scanId/suggestion/:suggestionId" element={<ProtectedRoute><SuggestionPage /></ProtectedRoute>} />
        <Route path="/results/:scanId/ewaste" element={<ProtectedRoute><EwastePage /></ProtectedRoute>} />
        <Route path="/log" element={<ProtectedRoute><LogPage /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;
