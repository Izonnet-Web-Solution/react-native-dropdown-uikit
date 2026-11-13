import React, { useEffect, useRef } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';
import { useKeyboard } from '../../hooks/useKeyboard';

export interface BottomSheetContainerProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  maxHeight?: number;
}

export const BottomSheetContainer: React.FC<BottomSheetContainerProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
  maxHeight,
}) => {
  const { theme, isDark } = useTheme();
  const { flexDirection, textAlign } = useRTL();
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();
  const screenHeight = Dimensions.get('window').height;
  const sheetMaxHeight = maxHeight || screenHeight * 0.7;

  const translateY = useRef(new Animated.Value(sheetMaxHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 24,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: sheetMaxHeight,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, translateY, sheetMaxHeight]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetMaxHeight,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.backdrop,
          {
            backgroundColor: theme.backdrop,
            opacity: fadeAnim,
          },
        ]}
      >
        <Pressable style={styles.backdropPressable} onPress={handleClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheetContainer,
          {
            maxHeight: sheetMaxHeight,
            backgroundColor: theme.surface,
            borderTopLeftRadius: theme.borderRadiusLg * 1.3,
            borderTopRightRadius: theme.borderRadiusLg * 1.3,
            borderColor: theme.border,
            bottom: isKeyboardVisible && keyboardHeight > 0 ? keyboardHeight : 0,
            transform: [{ translateY }],
          },
          styles.shadow,
          style,
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handleContainer}>
          <View
            style={[styles.handleBar, { backgroundColor: theme.border }]}
          />
        </View>

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
              onPress={handleClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: isDark ? '#334155' : '#F1F5F9',
                },
              ]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Close bottom sheet"
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
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  handleContainer: {
    width: '100%',
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
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
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
});
