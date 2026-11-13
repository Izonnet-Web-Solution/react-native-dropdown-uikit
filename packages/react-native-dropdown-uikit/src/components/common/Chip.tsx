import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';

export interface ChipProps {
  label: string;
  onRemove?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const { flexDirection } = useRTL();

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: theme.chipBackground,
          borderRadius: theme.borderRadiusSm,
          flexDirection,
        },
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="text"
    >
      <Text
        style={[
          styles.chipText,
          {
            color: theme.chipText,
            fontSize: theme.fontSizeSm,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {onRemove && !disabled ? (
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.removeButton}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <Text style={[styles.removeIcon, { color: theme.chipText }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontWeight: '500',
    marginRight: 4,
  },
  removeButton: {
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 10,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});

