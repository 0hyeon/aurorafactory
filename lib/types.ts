import { MouseEventHandler } from 'react';

export type SessionContent = {
  id?: number;
  user_id?: number;
};

export type SessionUser = {
  id: number;
  username: string;
  avatar: string | null;
};

export type ButtonProps = {
  children: React.ReactNode | string;
  icon?: React.ReactNode;
  type?: 'button' | 'reset' | 'submit';
  href?: string;
  isLoading?: boolean;
  method?: 'post' | 'delete';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  rounded?: boolean;
  outlined?: boolean;
  fullWidth?: boolean;
};
