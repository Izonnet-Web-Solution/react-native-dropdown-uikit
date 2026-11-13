import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';

export interface DropdownTriggerProps {
  isOpen: boolean;
  onPress: () => void;
  disabled?: boolean;
  placeholder?: string;
  selectedLabel?: string;
  hasValue?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  error?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  renderLeftIcon?: (isOpen: boolean) => React.ReactNode;
  renderRightIcon?: (isOpen: boolean) => React.ReactNode;
  children?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const DropdownTrigger = React.forwardRef<any, DropdownTriggerProps>(
  (
    {
      isOpen,
      onPress,
      disabled = false,
      placeholder = 'Select option...',
      selectedLabel,
      hasValue = false,
      clearable = false,
      onClear,
      error = false,
      style,
      textStyle,
      renderLeftIcon,
      renderRightIcon,
      children,
      accessibilityLabel,
      accessibilityHint,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { flexDirection, textAlign } = useRTL();

    const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [isOpen, rotateAnim]);

    const chevronRotation = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const handleClear = (e: any) => {
      e?.stopPropagation?.();
      onClear?.();
    };

    const borderColor = error
      ? theme.error
      : isOpen
      ? theme.borderFocus
      : theme.border;

    return (
      <View ref={ref} collapsable={false}>
        <TouchableOpacity
          style={[
            styles.trigger,
            {
              backgroundColor: theme.surface,
              borderColor,
              borderRadius: theme.borderRadiusMd,
              flexDirection,
            },
            disabled && styles.disabled,
            style,
          ]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
          accessibilityRole="combobox"
          accessibilityLabel={
            accessibilityLabel || selectedLabel || placeholder
          }
          accessibilityHint={
            accessibilityHint || 'Double tap to open selection menu'
          }
          accessibilityState={{ disabled, expanded: isOpen }}
        >
          {renderLeftIcon ? (
            <View style={styles.leftIconContainer}>
              {renderLeftIcon(isOpen)}
            </View>
          ) : null}

          <View style={styles.contentContainer}>
            {children ? (
              children
            ) : (
              <Text
                style={[
                  styles.triggerText,
                  {
                    color: hasValue || selectedLabel
                      ? theme.text
                      : theme.textPlaceholder,
                    fontSize: theme.fontSizeMd,
                    textAlign,
                  },
                  textStyle,
                ]}
                numberOfLines={1}
              >
                {selectedLabel || placeholder}
              </Text>
            )}
          </View>

          {clearable && hasValue && !disabled ? (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.clearButton}
              accessibilityRole="button"
              accessibilityLabel="Clear selection"
            >
              <Text style={[styles.clearIcon, { color: theme.textSecondary }]}>
                ✕
              </Text>
            </TouchableOpacity>
          ) : null}

          {renderRightIcon ? (
            <View style={styles.rightIconContainer}>
              {renderRightIcon(isOpen)}
            </View>
          ) : (
            <Animated.View
              style={[
                styles.chevronContainer,
                { transform: [{ rotate: chevronRotation }] },
              ]}
            >
              <Text
                style={[
                  styles.chevronText,
                  { color: disabled ? theme.textPlaceholder : theme.textSecondary },
                ]}
              >
                ▼
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

DropdownTrigger.displayName = 'DropdownTrigger';

const styles = StyleSheet.create({
  trigger: {
    minHeight: 48,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftIconContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  triggerText: {
    fontWeight: '400',
  },
  chevronContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 12,
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  clearIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});
