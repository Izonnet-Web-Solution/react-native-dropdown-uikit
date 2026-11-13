import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { PresentationMode } from '../../types/props';
import { DropdownLayout } from '../../hooks/useDropdown';
import { PopoverContainer } from './PopoverContainer';
import { ModalContainer } from './ModalContainer';
import { BottomSheetContainer } from './BottomSheetContainer';

export interface PresentationWrapperProps {
  presentation?: PresentationMode;
  visible: boolean;
  onClose: () => void;
  layout: DropdownLayout;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxHeight?: number;
}

export const PresentationWrapper: React.FC<PresentationWrapperProps> = ({
  presentation = 'popover',
  visible,
  onClose,
  layout,
  title,
  children,
  style,
  maxHeight,
}) => {
  if (presentation === 'bottom-sheet') {
    return (
      <BottomSheetContainer
        visible={visible}
        onClose={onClose}
        title={title}
        style={style}
        maxHeight={maxHeight}
      >
        {children}
      </BottomSheetContainer>
    );
  }

  if (presentation === 'modal') {
    return (
      <ModalContainer
        visible={visible}
        onClose={onClose}
        title={title}
        style={style}
        maxHeight={maxHeight}
      >
        {children}
      </ModalContainer>
    );
  }

  return (
    <PopoverContainer
      visible={visible}
      onClose={onClose}
      layout={layout}
      style={style}
      maxHeight={maxHeight}
    >
      {children}
    </PopoverContainer>
  );
};

