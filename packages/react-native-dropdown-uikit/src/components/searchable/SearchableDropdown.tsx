import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { CommonDropdownProps } from '../../types/props';
import { DropdownItem } from '../../types/item';
import { useDropdown } from '../../hooks/useDropdown';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownTrigger } from '../common/DropdownTrigger';
import { DropdownList } from '../common/DropdownList';
import { SearchInput } from '../common/SearchInput';
import { PresentationWrapper } from '../presentation/PresentationWrapper';

export interface SearchableDropdownProps<T = any> extends CommonDropdownProps<T> {
  value?: T | null;
  onChange?: (value: T | null, item?: DropdownItem<T>) => void;
  containerStyle?: StyleProp<ViewStyle>;
  customFilter?: (item: DropdownItem<T>, searchText: string) => boolean;
}

export function SearchableDropdown<T = any>({
  items,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  presentation = 'popover',
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
  customFilter,
}: SearchableDropdownProps<T>) {
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

  const selectedItem = useMemo(() => {
    if (value === undefined || value === null) return undefined;
    return items.find((item) => JSON.stringify(item.value) === JSON.stringify(value));
  }, [items, value]);

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return items;

    if (customFilter) {
      return items.filter((item) => customFilter(item, query));
    }

    return items.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(query);
      const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(query) : false;
      return matchLabel || matchSubtitle;
    });
  }, [items, searchText, customFilter]);

  const selectedValues = useMemo(() => {
    return value !== undefined && value !== null ? [value] : [];
  }, [value]);

  const handleSelect = useCallback(
    (item: DropdownItem<T>) => {
      onChange?.(item.value, item);
      closeDropdown();
      setSearchText('');
    },
    [onChange, closeDropdown]
  );

  const handleClear = useCallback(() => {
    onChange?.(null, undefined);
  }, [onChange]);

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
          selectedLabel={selectedItem?.label}
          hasValue={value !== undefined && value !== null}
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
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder={searchPlaceholder}
          autoFocus={presentation !== 'popover'}
        />
        <DropdownList
          items={filteredItems}
          selectedValues={selectedValues}
          onSelect={handleSelect}
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

