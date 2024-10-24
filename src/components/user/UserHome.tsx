// src/components/user/UserHome.tsx

'use client';

import React from 'react';
import { UserQrCodeReader } from './UserQrCodeReaderView';
import { UserHomeFAB } from './UserHomeFAB';

export function UserHome() {
  return (
    <>
      <UserQrCodeReader />
      <UserHomeFAB />
    </>
  );
}
