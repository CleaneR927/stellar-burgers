import { FC } from 'react';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userName = 'test';
  return <AppHeaderUI userName={userName} />;
};
