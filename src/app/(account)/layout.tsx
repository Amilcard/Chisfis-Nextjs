// src/app/(account)/layout.tsx
import React, { ReactNode } from 'react';
import { ApplicationLayout } from '../(app)/application-layout';
import PageNavigation from './PageNavigation';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <ApplicationLayout header={<PageNavigation />}>
      {children}
    </ApplicationLayout>
  );
}
