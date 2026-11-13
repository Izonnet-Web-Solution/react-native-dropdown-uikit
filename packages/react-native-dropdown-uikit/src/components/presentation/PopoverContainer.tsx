import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { DropdownLayout } from '../../hooks/useDropdown';

export interface PopoverContainerProps {
  visible: boolean;
  onClose: () => void;
  layout: DropdownLayout;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxHeight?: number;
}

export const PopoverContainer: React.FC<PopoverContainerProps> = ({
  visible,
  onClose,
  layout,
  children,
  style,
  maxHeight,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.popover,
            {
              top: layout.placement === 'bottom' ? layout.top : undefined,
              bottom: layout.placement === 'top' ? layout.bottom : undefined,
              left: layout.left,
              width: layout.width || '90%',
              maxHeight: maxHeight || layout.maxHeight || 280,
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: theme.borderRadiusMd,
            },
            styles.shadow,
            style,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  popover: {
    position: 'absolute',
    borderWidth: 1,
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
});
