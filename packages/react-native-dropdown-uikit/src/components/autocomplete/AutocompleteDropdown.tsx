import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
import { CommonDropdownProps } from '../../types/props';
import { DropdownItem } from '../../types/item';
import { useDropdown } from '../../hooks/useDropdown';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownList } from '../common/DropdownList';

export interface AutocompleteDropdownProps<T = any>
  extends Omit<CommonDropdownProps<T>, 'presentation'> {
  value?: string;
  onTextChange?: (text: string) => void;
  onSelect?: (item: DropdownItem<T>) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  filterPredicate?: (item: DropdownItem<T>, query: string) => boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function AutocompleteDropdown<T = any>({
  items,
  value = '',
  onTextChange,
  onSelect,
  placeholder = 'Type to search...',
  placement = 'auto',
  disabled = false,
  clearable = true,
  label,
  required,
  error,
  helperText,
  labelStyle,
  errorStyle,
  helperTextStyle,
  style,
  triggerStyle,
  dropdownStyle,
  itemStyle,
  itemTextStyle,
  inputStyle,
  maxHeight = 260,
  itemHeight = 44,
  renderLeftIcon,
  emptyText = 'No suggestions found',
  emptyComponent,
  loading = false,
  loadingText,
  loadingComponent,
  accessibilityLabel,
  accessibilityHint,
  containerStyle,
  filterPredicate,
  onFocus,
  onBlur,
}: AutocompleteDropdownProps<T>) {
  const { theme } = useTheme();
  const { flexDirection, textAlign } = useRTL();
  const [query, setQuery] = useState(value);
  const inputRef = useRef<any>(null);
  const blurTimeoutRef = useRef<any>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Clean up blur timer on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const {
    isOpen,
    layout,
    triggerRef,
    openDropdown,
    closeDropdown,
  } = useDropdown({
    placement,
    maxHeight,
    disabled,
  });

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    if (filterPredicate) {
      return items.filter((item) => filterPredicate(item, q));
    }

    return items.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(q);
      const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false;
      return matchLabel || matchSubtitle;
    });
  }, [items, query, filterPredicate]);

  const handleChangeText = (text: string) => {
    setQuery(text);
    onTextChange?.(text);
    if (!isOpen) {
      openDropdown();
    }
  };

  const handleFocus = () => {
    openDropdown();
    onFocus?.();
  };

  const handleBlur = () => {
    // 200ms grace period so that tapping an item in the list registers before dropdown closes
    blurTimeoutRef.current = setTimeout(() => {
      closeDropdown();
      onBlur?.();
    }, 200);
  };

  const handleSelectItem = useCallback(
    (item: DropdownItem<T>) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      setQuery(item.label);
      onTextChange?.(item.label);
      onSelect?.(item);
      closeDropdown();
      inputRef.current?.blur();
    },
    [onTextChange, onSelect, closeDropdown]
  );

  const handleClear = () => {
    setQuery('');
    onTextChange?.('');
    closeDropdown();
  };

  const borderColor = error
    ? theme.error
    : isOpen
    ? theme.borderFocus
    : theme.border;

  return (
    <View
      style={[
        styles.outerContainer,
        containerStyle,
        isOpen && styles.outerContainerOpen,
      ]}
    >
      <FormWrapper
        label={label}
        required={required}
        error={error}
        helperText={helperText}
        disabled={disabled}
        labelStyle={labelStyle}
        errorStyle={errorStyle}
        helperTextStyle={helperTextStyle}
      >
        <View
          ref={triggerRef}
          collapsable={false}
          style={[styles.triggerWrapper, isOpen && styles.triggerWrapperOpen]}
        >
          <View
            style={[
              styles.inputTrigger,
              {
                backgroundColor: theme.surface,
                borderColor,
                borderRadius: theme.borderRadiusMd,
                flexDirection,
              },
              disabled && styles.disabled,
              triggerStyle,
              style,
            ]}
          >
            {renderLeftIcon ? (
              <View style={styles.leftIconContainer}>
                {renderLeftIcon(isOpen)}
              </View>
            ) : null}

            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                {
                  color: theme.text,
                  fontSize: theme.fontSizeMd,
                  textAlign,
                },
                inputStyle,
              ]}
              value={query}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor={theme.textPlaceholder}
              editable={!disabled}
              autoCorrect={false}
              autoCapitalize="none"
              accessibilityRole="combobox"
              accessibilityState={{ expanded: isOpen, disabled }}
              accessibilityLabel={accessibilityLabel || label || placeholder}
              accessibilityHint={accessibilityHint}
            />

            {clearable && query.length > 0 && !disabled ? (
              <TouchableOpacity
                onPress={handleClear}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.clearBtn}
                accessibilityRole="button"
                accessibilityLabel="Clear input"
              >
                <Text style={[styles.clearIcon, { color: theme.textSecondary }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {isOpen && (
            <View
              style={[
                styles.floatingDropdown,
                layout.placement === 'top'
                  ? styles.floatingTop
                  : styles.floatingBottom,
                {
                  maxHeight: layout.maxHeight || maxHeight,
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  borderRadius: theme.borderRadiusMd,
                },
                styles.shadow,
                dropdownStyle,
              ]}
            >
              <DropdownList
                items={filteredItems}
                selectedValues={[]}
                onSelect={handleSelectItem}
                itemHeight={itemHeight}
                itemStyle={itemStyle}
                itemTextStyle={itemTextStyle}
                emptyText={emptyText}
                emptyComponent={emptyComponent}
                loading={loading}
                loadingText={loadingText}
                loadingComponent={loadingComponent}
                nested={true}
              />
            </View>
          )}
        </View>
      </FormWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    zIndex: 1,
  },
  outerContainerOpen: {
    zIndex: 9999,
  },
  triggerWrapper: {
    position: 'relative',
    zIndex: 1,
  },
  triggerWrapperOpen: {
    zIndex: 10000,
  },
  inputTrigger: {
    height: 48,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  leftIconContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 6,
  },
  clearIcon: {
    fontSize: 12,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  floatingDropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10001,
    elevation: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  floatingTop: {
    bottom: '100%',
    marginBottom: 4,
  },
  floatingBottom: {
    top: '100%',
    marginTop: 4,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
});
