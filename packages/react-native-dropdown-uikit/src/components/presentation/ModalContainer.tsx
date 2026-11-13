import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';

export interface ModalContainerProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxHeight?: number;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
  maxHeight,
}) => {
  const { theme, isDark } = useTheme();
  const { flexDirection, textAlign } = useRTL();
  const screenHeight = Dimensions.get('window').height;
  const computedMaxHeight = maxHeight || screenHeight * 0.75;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.backdrop }]}
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: theme.borderRadiusLg,
              maxHeight: computedMaxHeight,
            },
            styles.shadow,
            style,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {title ? (
            <View
              style={[
                styles.header,
                { borderBottomColor: theme.border, flexDirection },
              ]}
            >
              <Text
                style={[
                  styles.title,
                  { color: theme.text, fontSize: theme.fontSizeLg, textAlign },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={[
                  styles.closeBtn,
                  {
                    backgroundColor: isDark ? '#334155' : '#F1F5F9',
                  },
                ]}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Close modal"
              >
                <View style={styles.crossIcon}>
                  <View
                    style={[
                      styles.crossLine,
                      styles.crossLineDiagonal1,
                      { backgroundColor: theme.textSecondary },
                    ]}
                  />
                  <View
                    style={[
                      styles.crossLine,
                      styles.crossLineDiagonal2,
                      { backgroundColor: theme.textSecondary },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.content}>{children}</View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    height: 52,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: '600',
    flex: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  crossIcon: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crossLine: {
    position: 'absolute',
    width: 12,
    height: 1.8,
    borderRadius: 1,
  },
  crossLineDiagonal1: {
    transform: [{ rotate: '45deg' }],
  },
  crossLineDiagonal2: {
    transform: [{ rotate: '-45deg' }],
  },
  content: {
    flexShrink: 1,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
});

