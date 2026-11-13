import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { CommonDropdownProps } from '../../types/props';
import { DropdownItem } from '../../types/item';
import { useDropdown } from '../../hooks/useDropdown';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownTrigger } from '../common/DropdownTrigger';
import { CheckboxItem } from '../common/CheckboxItem';
import { SearchInput } from '../common/SearchInput';
import { PresentationWrapper } from '../presentation/PresentationWrapper';

export interface CheckboxDropdownProps<T = any> extends CommonDropdownProps<T> {
  values?: T[];
  onChange?: (values: T[], items: DropdownItem<T>[]) => void;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  deselectAllLabel?: string;
  searchable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function CheckboxDropdown<T = any>({
  items,
  values = [],
  onChange,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search options...',
  presentation = 'popover',
  placement = 'auto',
  disabled = false,
  clearable = true,
  showSelectAll = true,
  selectAllLabel = 'Select All',
  deselectAllLabel = 'Deselect All',
  searchable = true,
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
  maxHeight = 340,
  itemHeight = 48,
  renderLeftIcon,
  renderRightIcon,
  emptyText = 'No options found',
  emptyComponent,
  loading = false,
  loadingText = 'Loading options...',
  loadingComponent,
  accessibilityLabel,
  accessibilityHint,
  onOpen,
  onClose,
  modalTitle,
  containerStyle,
}: CheckboxDropdownProps<T>) {
  const { theme } = useTheme();
  const { flexDirection } = useRTL();
  const [searchText, setSearchText] = useState('');

  const {
    isOpen,
    layout,
    triggerRef,
    toggleDropdown,
    closeDropdown,
  } = useDropdown({
    placement,
    maxHeight,
    disabled,
    onOpen: () => {
      setSearchText('');
      onOpen?.();
    },
    onClose,
  });

  const selectedItems = useMemo(() => {
    return items.filter((item) =>
      values.some((v) => JSON.stringify(v) === JSON.stringify(item.value))
    );
  }, [items, values]);

  const filteredItems = useMemo(() => {
    if (!searchable || !searchText.trim()) return items;
    const query = searchText.trim().toLowerCase();
    return items.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(query) : false;
      return matchLabel || matchSubtitle;
    });
  }, [items, searchText, searchable]);

  const enabledItems = useMemo(() => {
    return items.filter((i) => !i.disabled);
  }, [items]);

  const isAllSelected = useMemo(() => {
    if (enabledItems.length === 0) return false;
    return enabledItems.every((item) =>
      values.some((v) => JSON.stringify(v) === JSON.stringify(item.value))
    );
  }, [enabledItems, values]);

  const handleToggle = useCallback(
    (item: DropdownItem<T>) => {
      const exists = values.some((v) => JSON.stringify(v) === JSON.stringify(item.value));
      let newValues: T[];

      if (exists) {
        newValues = values.filter((v) => JSON.stringify(v) !== JSON.stringify(item.value));
      } else {
        newValues = [...values, item.value];
      }

      const newItems = items.filter((i) =>
        newValues.some((v) => JSON.stringify(v) === JSON.stringify(i.value))
      );
      onChange?.(newValues, newItems);
    },
    [values, items, onChange]
  );

  const handleSelectAllToggle = useCallback(() => {
    if (isAllSelected) {
      onChange?.([], []);
    } else {
      const allValues = enabledItems.map((i) => i.value);
      onChange?.(allValues, enabledItems);
    }
  }, [isAllSelected, enabledItems, onChange]);

  const handleClear = useCallback(() => {
    onChange?.([], []);
  }, [onChange]);

  const triggerLabel = useMemo(() => {
    if (selectedItems.length === 0) return undefined;
    if (selectedItems.length === 1) return selectedItems[0].label;
    return `${selectedItems.length} items selected`;
  }, [selectedItems]);

  return (
    <View style={containerStyle}>
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
        <DropdownTrigger
          ref={triggerRef}
          isOpen={isOpen}
          onPress={toggleDropdown}
          disabled={disabled}
          placeholder={placeholder}
          selectedLabel={triggerLabel}
          hasValue={values.length > 0}
          clearable={clearable}
          onClear={handleClear}
          error={!!error}
          style={[triggerStyle, style]}
          renderLeftIcon={renderLeftIcon}
          renderRightIcon={renderRightIcon}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />
      </FormWrapper>

      <PresentationWrapper
        presentation={presentation}
        visible={isOpen}
        onClose={closeDropdown}
        layout={layout}
        title={modalTitle || label || placeholder}
        style={dropdownStyle}
        maxHeight={maxHeight}
      >
        {searchable ? (
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder={searchPlaceholder}
            autoFocus={presentation !== 'popover'}
          />
        ) : null}

        {loading ? (
          loadingComponent ? (
            <>{loadingComponent}</>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
              {loadingText ? (
                <Text
                  style={[
                    styles.loadingText,
                    { color: theme.textSecondary, fontSize: theme.fontSizeSm },
                  ]}
                >
                  {loadingText}
                </Text>
              ) : null}
            </View>
          )
        ) : (
          <>
            {showSelectAll && filteredItems.length > 0 ? (
              <View
                style={[
                  styles.selectAllBar,
                  { borderBottomColor: theme.divider, flexDirection },
                ]}
              >
                <TouchableOpacity
                  onPress={handleSelectAllToggle}
                  style={[styles.selectAllButton, { flexDirection }]}
                  accessibilityRole="button"
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      {
                        borderColor: isAllSelected ? theme.primary : theme.border,
                        backgroundColor: isAllSelected ? theme.primary : 'transparent',
                        borderRadius: theme.borderRadiusSm / 1.5,
                      },
                    ]}
                  >
                    {isAllSelected ? <Text style={styles.checkIcon}>✓</Text> : null}
                  </View>
                  <Text
                    style={[
                      styles.selectAllText,
                      { color: theme.primary, fontSize: theme.fontSizeMd },
                    ]}
                  >
                    {isAllSelected ? deselectAllLabel : selectAllLabel}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <FlatList
              data={filteredItems}
              keyExtractor={(item, index) => `${String(item.value)}-${index}`}
              renderItem={({ item }) => (
                <CheckboxItem
                  item={item}
                  selected={values.some((v) => JSON.stringify(v) === JSON.stringify(item.value))}
                  onPress={handleToggle}
                  itemHeight={itemHeight}
                  style={itemStyle}
                  textStyle={itemTextStyle}
                />
              )}
              initialNumToRender={8}
              maxToRenderPerBatch={10}
              windowSize={5}
              ListEmptyComponent={
                emptyComponent ? (
                  <>{emptyComponent}</>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                      {emptyText}
                    </Text>
                  </View>
                )
              }
            />
          </>
        )}
      </PresentationWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  selectAllBar: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selectAllButton: {
    alignItems: 'center',
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginTop: -1,
  },
  selectAllText: {
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  loadingContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  loadingText: {
    marginTop: 10,
    fontWeight: '500',
  },
});

