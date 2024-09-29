import React from "react";
import { useParams } from 'react-router-dom';
import UserFeedPage from "./UserFeedPage";

export default function NotFound() {
  const params = useParams();
  if (params.handle?.startsWith('@')) {
    return (
      <UserFeedPage />
    );
  }
  return (
    'Not found'
  );
}