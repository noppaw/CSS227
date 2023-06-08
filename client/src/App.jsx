import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import GalleryPage from './pages/GalleryPage'
import GalleryFormPage from './pages/GalleryFormPage'
import ItemsPage from './pages/ItemsPage'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/gallery" element={<GalleryPage />} />
          <Route path="/account/gallery/new" element={<GalleryFormPage />} />
          <Route path="/account/gallery/:id" element={<GalleryFormPage />} />
          <Route path="/gallery/:id" element={<ItemsPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
