import './App.css';
import './components/Popup.css';

import HomeFeedPage from './pages/HomeFeedPage';
import NotificationsFeedPage from './pages/NotificationsFeedPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import RecoverPage from './pages/RecoverPage';
import MessageGroupsPage from './pages/MessageGroupsPage';
import MessageGroupPage from './pages/MessageGroupPage';
import MessageGroupNewPage from './pages/MessageGroupNewPage';
import ConfirmationPage from './pages/ConfirmationPage';
import NotFound from './pages/NotFound';
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env.REACT_APP_AWS_USER_POOL_CLIENT_ID,
      userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    }
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeFeedPage />
  },
  {
    path: "/notifications",
    element: <NotificationsFeedPage />
  },
  {
    path: "/messages",
    element: <MessageGroupsPage />
  },
  {
    path: "/messages/:message_group_uuid",
    element: <MessageGroupPage />
  },
  {
    path: "/messages/new/:handle",
  element: <MessageGroupNewPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/signin",
    element: <SigninPage />
  },
  {
    path: "/confirm",
    element: <ConfirmationPage />
  },
  {
    path: "/forgot",
    element: <RecoverPage />
  },
  {
    path: "/:handle",
    element: <NotFound />
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;