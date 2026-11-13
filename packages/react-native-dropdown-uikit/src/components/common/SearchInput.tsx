import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';

export interface SearchIconProps {
  color: string;
  size?: number;
}

export const SearchIcon: React.FC<SearchIconProps> = ({ color, size = 15 }) => {
  return (
    <View style={[styles.searchIconWrapper, { width: size, height: size }]}>
      <View
        style={[
          styles.searchCircle,
          {
            borderColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.searchHandle,
          {
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  renderLeftIcon?: (color: string) => React.ReactNode;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  autoFocus = false,
  style,
  inputStyle,
  renderLeftIcon,
}) => {
  const { theme } = useTheme();
  const { flexDirection, textAlign } = useRTL();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: theme.borderRadiusSm,
          flexDirection,
        },
        style,
      ]}
    >
      {renderLeftIcon ? (
        <View style={styles.iconContainer}>{renderLeftIcon(theme.textSecondary)}</View>
      ) : (
        <View style={styles.iconContainer}>
          <SearchIcon color={theme.textSecondary} />
        </View>
      )}

      <TextInput
        style={[
          styles.input,
          {
            color: theme.text,
            fontSize: theme.fontSizeMd,
            textAlign,
          },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textPlaceholder}
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityRole="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={[styles.clearText, { color: theme.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
  },
  iconContainer: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCircle: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.6,
  },
  searchHandle: {
    position: 'absolute',
    bottom: 1.5,
    right: 1.5,
    width: 1.8,
    height: 5.5,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    height: '100%',
  },
  clearButton: {
    padding: 4,
    marginLeft: 6,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
