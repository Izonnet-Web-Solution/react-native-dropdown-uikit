import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { DropdownItem } from './item';
import { ThemeTokens, ThemeMode } from './theme';

export type PresentationMode = 'popover' | 'modal' | 'bottom-sheet';
export type PopoverPlacement = 'auto' | 'top' | 'bottom';

export interface FormValidationProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
}

export interface CommonDropdownProps<T = any> extends FormValidationProps {
  items: DropdownItem<T>[];
  placeholder?: string;
  presentation?: PresentationMode;
  placement?: PopoverPlacement;
  clearable?: boolean;
  theme?: Partial<ThemeTokens>;
  themeMode?: ThemeMode;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  maxHeight?: number;
  itemHeight?: number;
  renderLeftIcon?: (isOpen: boolean) => ReactNode;
  renderRightIcon?: (isOpen: boolean) => ReactNode;
  renderItem?: (item: DropdownItem<T>, isSelected: boolean) => ReactNode;
  emptyText?: string;
  emptyComponent?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  loadingComponent?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  onOpen?: () => void;
  onClose?: () => void;
  searchPlaceholder?: string;
  modalTitle?: string;
  testID?: string;
}

