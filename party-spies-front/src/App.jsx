
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom';

import CreateRoom from './pages/CreateRoomPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import MainLayout from './layouts/MainLayout';
import JoinRoom from './pages/JoinRoomPage';
import JoinInvite from './pages/JoinInvitePage';
import RoomWrongRoom from './pages/RoomWrongRoomPage';
import Privacy from './pages/HelpPrivacyPage';
import Terms from './pages/HelpTermsOfUsePage';


const App = () => {

  //Router list
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element = {<MainLayout />}>
        <Route path='/about' element = {<AboutPage/>} />
        <Route path='/create' element = {<CreateRoom/>} />
        <Route path='/join' element = {<JoinRoom/>} />
        <Route path='/join/:id' element = {<JoinInvite/>} />
        <Route path='/room' element = {<RoomWrongRoom />} />
        <Route path='/privacy' element = {<Privacy />} />
        <Route path='/terms' element = {<Terms />} />
        
        
        <Route path='*' element = {<NotFoundPage/>} />
        
        <Route index element = {<HomePage/>} />

      </Route>
      </>
    )
  );


  return (
    < RouterProvider router={router}/>
  )
}

export default App
