import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { EventProvider } from '@/context/EventContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoutes from '@/utils/PrivateRoutes';
import Loader from '@/components/Loader';

const Header = lazy(() => import('@/components/header/Header'));
const Home = lazy(() => import('@/pages/Home'));
const Footer = lazy(() => import('@/components/Footer'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const ErrorPageWrapper = lazy(() => import('@/pages/auth/ErrorPageWrapper'));
const Profile = lazy(() => import('@/pages/profile/Profile'));
const CreateEventContainer = lazy(() => import('@/pages/create-event/CreateEventContainer'));
const EventContainer = lazy(() => import('@/pages/event/EventContainer'));
const EventsPage = lazy(() => import('@/pages/event/EventsPage'));
const JoinEvent = lazy(() => import('@/pages/JoinEvent'));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className='relative flex min-h-screen flex-col'>
              <Header />
              <Routes>
                <Route
                  path='/'
                  element={<Home />}
                />
                <Route
                  path='/signup'
                  element={<SignUp />}
                />
                <Route
                  path='/signin'
                  element={<SignIn />}
                />
                <Route
                  path='/error'
                  element={<ErrorPageWrapper />}
                />
                <Route
                  path='*'
                  element={<Navigate to='/error' />}
                />
                <Route element={<PrivateRoutes />}>
                  <Route
                    path='/join'
                    element={<JoinEvent />}
                  />
                  <Route
                    path='/profile'
                    element={<Profile />}
                  />
                  <Route
                    path='/create-event'
                    element={
                      <EventProvider>
                        <CreateEventContainer />
                      </EventProvider>
                    }
                  />
                  <Route
                    path='/my-events'
                    element={<EventsPage />}
                  />
                  <Route
                    path='/event/:id'
                    element={<EventContainer />}
                  />
                </Route>
              </Routes>
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
