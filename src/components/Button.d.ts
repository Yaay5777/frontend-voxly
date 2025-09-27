import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'neon' | 'outline';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

declare const Button: FC<ButtonProps>;

export default Button;
