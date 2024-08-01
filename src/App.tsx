import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Home,
  Explore,
  CreatePost,
  Profile,
  SavedPosts,
  Reels,
  AllUsers,
  Chats,
  EditPost,
  updateProfile,
  LogIn,
  SignUp,
} from '@/pages/index';
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/_main/ProtectedRoute';
import { QueryProvider } from './lib/react-query/QueryProvider';
import UpdateProfile from './pages/_main/UpdateProfile';

function App() {
  const protectedRoutes = [
    { path: '/', element: <Home /> },
    { path: '/home', element: <Home /> },
    { path: '/explore', element: <Explore /> },
    { path: '/saved-posts', element: <SavedPosts /> },
    { path: '/profile/:id', element: <Profile /> },
    { path: '/create-post', element: <CreatePost /> },
    { path: '/reels', element: <Reels /> },
    { path: '/posts/:id', element: <EditPost /> },
    { path: '/update-profile/:id', element: <UpdateProfile /> },
    { path: '/all-users', element: <AllUsers /> },
    { path: '/chats', element: <Chats /> },
  ];

  return (
    <QueryProvider>
      <AuthContextProvider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              {protectedRoutes.map((item, index) => (
                <Route
                  key={index}
                  path={item.path}
                  element={<ProtectedRoute>{item.element}</ProtectedRoute>}
                />
              ))}
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/log-in" element={<LogIn />} />
            </Route>
          </Routes>
        </Router>
      </AuthContextProvider>
    </QueryProvider>
  );
}

export default App;
