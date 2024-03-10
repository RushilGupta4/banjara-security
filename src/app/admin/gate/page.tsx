'use client';

import GenericStatusUpdatePage from '@/components/StatusUpdatePage';

export default function GatePage() {
  return (
    <GenericStatusUpdatePage
      key={'gateStatus'}
      title={'Gate'}
      actionTrue={'Sign In'}
      actionFalse={'Sign Out'}
      confirmationMessageTrue={'Are you sure you want to sign in this user?'}
      confirmationMessageFalse={'Are you sure you want to sign out this user?'}
      successMessageTrue={'User has been signed in.'}
      successMessageFalse={'User has been signed out.'}
      alreadyTrueMessage={'User is already signed in.'}
      alreadyFalseMessage={'User is already signed out.'}
    />
  );
}
