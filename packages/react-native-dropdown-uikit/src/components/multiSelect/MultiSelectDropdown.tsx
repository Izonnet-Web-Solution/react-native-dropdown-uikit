import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native';
import { CommonDropdownProps } from '../../types/props';
import { DropdownItem } from '../../types/item';
import { useDropdown } from '../../hooks/useDropdown';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownTrigger } from '../common/DropdownTrigger';
import { DropdownList } from '../common/DropdownList';
import { SearchInput } from '../common/SearchInput';
import { Chip } from '../common/Chip';
import { PresentationWrapper } from '../presentation/PresentationWrapper';

export interface MultiSelectDropdownProps<T = any> extends CommonDropdownProps<T> {
  values?: T[];
  onChange?: (values: T[], items: DropdownItem<T>[]) => void;
  maxSelect?: number;
  maxDisplayChips?: number;
  searchable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export function MultiSelectDropdown<T = any>({
  items,
  values = [],
  onChange,
  placeholder = 'Select multiple options...',
  searchPlaceholder = 'Search options...',
  presentation = 'popover',
  placement = 'auto',
  disabled = false,
  clearable = true,
  maxSelect,
  maxDisplayChips = 3,
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
  maxHeight = 320,
  itemHeight = 48,
  renderLeftIcon,
  renderRightIcon,
  renderItem,
  emptyText = 'No matching options',
  emptyComponent,
  loading = false,
  loadingText,
  loadingComponent,
  accessibilityLabel,
  accessibilityHint,
  onOpen,
  onClose,
  modalTitle,
  containerStyle,
}: MultiSelectDropdownProps<T>) {
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

  const handleToggle = useCallback(
    (item: DropdownItem<T>) => {
      const exists = values.some((v) => JSON.stringify(v) === JSON.stringify(item.value));
      let newValues: T[];

      if (exists) {
        newValues = values.filter((v) => JSON.stringify(v) !== JSON.stringify(item.value));
      } else {
        if (maxSelect !== undefined && values.length >= maxSelect) {
          return;
        }
        newValues = [...values, item.value];
      }

      const newItems = items.filter((i) =>
        newValues.some((v) => JSON.stringify(v) === JSON.stringify(i.value))
      );
      onChange?.(newValues, newItems);
    },
    [values, items, maxSelect, onChange]
  );

  const handleRemoveValue = useCallback(
    (val: T) => {
      const newValues = values.filter((v) => JSON.stringify(v) !== JSON.stringify(val));
      const newItems = items.filter((i) =>
        newValues.some((v) => JSON.stringify(v) === JSON.stringify(i.value))
      );
      onChange?.(newValues, newItems);
    },
    [values, items, onChange]
  );

  const handleClear = useCallback(() => {
    onChange?.([], []);
  }, [onChange]);

  const chipsToRender = selectedItems.slice(0, maxDisplayChips);
  const remainingCount = selectedItems.length - maxDisplayChips;

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
          hasValue={values.length > 0}
          clearable={clearable}
          onClear={handleClear}
          error={!!error}
          style={[triggerStyle, style]}
          renderLeftIcon={renderLeftIcon}
          renderRightIcon={renderRightIcon}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        >
          {selectedItems.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {chipsToRender.map((item) => (
                <Chip
                  key={String(item.value)}
                  label={item.label}
                  disabled={disabled}
                  onRemove={() => handleRemoveValue(item.value)}
                />
              ))}
              {remainingCount > 0 ? (
                <Chip
                  label={`+${remainingCount} more`}
                  disabled={disabled}
                />
              ) : null}
            </ScrollView>
          ) : null}
        </DropdownTrigger>
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
        <DropdownList
          items={filteredItems}
          selectedValues={values}
          onSelect={handleToggle}
          renderItem={renderItem}
          itemHeight={itemHeight}
          itemStyle={itemStyle}
          itemTextStyle={itemTextStyle}
          emptyText={emptyText}
          emptyComponent={emptyComponent}
          loading={loading}
          loadingText={loadingText}
          loadingComponent={loadingComponent}
        />
      </PresentationWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingVertical: 2,
  },
});

