import React from 'react';

export interface DropdownItem<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  subtitle?: string;
  badge?: string | number;
  icon?: React.ReactNode | ((props: { color: string; size: number }) => React.ReactNode);
  customData?: Record<string, any>;
}

export interface GroupedItem<T = any> {
  title: string;
  data: DropdownItem<T>[];
}

export interface CascadingItem<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  subtitle?: string;
  icon?: React.ReactNode | ((props: { color: string; size: number }) => React.ReactNode);
  children?: CascadingItem<T>[];
}

