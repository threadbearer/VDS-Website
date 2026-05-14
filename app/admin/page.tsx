import React from 'react';
import { isUserAuthenticated } from './actions';
import AdminDashboard from './AdminDashboard';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vega Admin | AI Assistant Intelligence',
  description: 'Secure pipeline management for Vega Design Studio intake interactions.',
};

export default async function AdminPage() {
  // Verify server-side authentication before rendering the dashboard payload
  const authenticated = await isUserAuthenticated();

  if (!authenticated) {
    return <LoginForm />;
  }

  return <AdminDashboard />;
}
