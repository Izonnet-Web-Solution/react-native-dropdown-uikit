import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { DropdownItem } from '../../types/item';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';

export interface CheckboxItemProps<T = any> {
  item: DropdownItem<T>;
  selected: boolean;
  onPress: (item: DropdownItem<T>) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  itemHeight?: number;
}

export const CheckboxItem = React.memo(
  <T,>({
    item,
    selected,
    onPress,
    style,
    textStyle,
    itemHeight,
  }: CheckboxItemProps<T>) => {
    const { theme } = useTheme();
    const { flexDirection, textAlign } = useRTL();

    const handlePress = () => {
      if (!item.disabled) {
        onPress(item);
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.container,
          {
            height: itemHeight || theme.itemHeight,
            borderBottomColor: theme.divider,
            flexDirection,
          },
          selected && { backgroundColor: theme.primaryLight },
          item.disabled && styles.disabled,
          style,
        ]}
        onPress={handlePress}
        disabled={item.disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected, disabled: !!item.disabled }}
        accessibilityLabel={`${item.label}${selected ? ', selected' : ''}`}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: selected ? theme.primary : theme.border,
              backgroundColor: selected ? theme.primary : 'transparent',
              borderRadius: theme.borderRadiusSm / 1.5,
            },
          ]}
        >
          {selected ? <Text style={styles.checkIcon}>✓</Text> : null}
        </View>

        {item.icon ? (
          <View style={styles.iconContainer}>
            {typeof item.icon === 'function'
              ? item.icon({ color: selected ? theme.primary : theme.text, size: 20 })
              : item.icon}
          </View>
        ) : null}

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.label,
              {
                color: item.disabled
                  ? theme.textPlaceholder
                  : selected
                  ? theme.primary
                  : theme.text,
                fontSize: theme.fontSizeMd,
                textAlign,
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
          {item.subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary, fontSize: theme.fontSizeSm, textAlign },
              ]}
              numberOfLines={1}
            >
              {item.subtitle}
            </Text>
          ) : null}
        </View>

        {item.badge !== undefined ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.chipBackground, borderRadius: theme.borderRadiusSm },
            ]}
          >
            <Text style={[styles.badgeText, { color: theme.chipText }]}>
              {item.badge}
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
) as <T>(props: CheckboxItemProps<T>) => React.ReactElement;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: -1,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
  },
  subtitle: {
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

