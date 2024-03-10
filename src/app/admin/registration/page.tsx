'use client';

import GenericStatusUpdatePage from '@/components/StatusUpdatePage';

export default function RegistationPage() {
  return (
    <GenericStatusUpdatePage
      key='registered'
      title='Registration'
      actionTrue='Register'
      actionFalse='Unregister'
      confirmationMessageTrue='Are you sure you want to register this user?'
      confirmationMessageFalse='Are you sure you want to unregister this user?'
      successMessageTrue='User has been registered.'
      successMessageFalse='User has been unregistered.'
      alreadyTrueMessage='User is already registered.'
      alreadyFalseMessage='User is already unregistered.'
    />
  );
}
