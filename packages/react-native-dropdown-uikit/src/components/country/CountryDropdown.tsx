import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { CommonDropdownProps } from '../../types/props';
import { DropdownItem } from '../../types/item';
import { COUNTRIES, CountryData } from './countryData';
import { useDropdown } from '../../hooks/useDropdown';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownTrigger } from '../common/DropdownTrigger';
import { DropdownList } from '../common/DropdownList';
import { SearchInput } from '../common/SearchInput';
import { PresentationWrapper } from '../presentation/PresentationWrapper';

export interface CountryDropdownProps
  extends Omit<CommonDropdownProps<string | CountryData>, 'items'> {
  value?: string | CountryData | null;
  onChange?: (country: CountryData | null) => void;
  valueType?: 'code' | 'dialCode' | 'name' | 'object';
  showDialCode?: boolean;
  showFlag?: boolean;
  customCountries?: CountryData[];
  containerStyle?: StyleProp<ViewStyle>;
}

export function CountryDropdown({
  value,
  onChange,
  valueType: _valueType = 'code',
  showDialCode = true,
  showFlag = true,
  customCountries,
  placeholder = 'Select Country',
  searchPlaceholder = 'Search country name or dial code (+91, US)...',
  presentation = 'modal',
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
  maxHeight = 360,
  itemHeight = 48,
  renderLeftIcon,
  renderRightIcon,
  emptyText = 'No matching countries',
  emptyComponent,
  loading = false,
  loadingText,
  loadingComponent,
  accessibilityLabel,
  accessibilityHint,
  onOpen,
  onClose,
  modalTitle = 'Select Country',
  containerStyle,
}: CountryDropdownProps) {
  const [searchText, setSearchText] = useState('');

  const countryDataset = useMemo(() => {
    return customCountries || COUNTRIES;
  }, [customCountries]);

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

  const selectedCountry = useMemo(() => {
    if (!value) return undefined;
    if (typeof value === 'object' && 'code' in value) {
      return value as CountryData;
    }
    const valStr = String(value).toUpperCase();
    return countryDataset.find(
      (c) =>
        c.code.toUpperCase() === valStr ||
        c.dialCode === value ||
        c.name.toUpperCase() === valStr
    );
  }, [value, countryDataset]);

  const items: DropdownItem<CountryData>[] = useMemo(() => {
    return countryDataset.map((country) => ({
      label: `${country.name}`,
      value: country,
      subtitle: showDialCode ? `${country.dialCode} (${country.code})` : country.code,
      icon: showFlag ? (
        <Text style={styles.flagIcon}>{country.flag}</Text>
      ) : undefined,
    }));
  }, [countryDataset, showDialCode, showFlag]);

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      const country = item.value;
      const matchName = country.name.toLowerCase().includes(query);
      const matchCode = country.code.toLowerCase().includes(query);
      const matchDial = country.dialCode.toLowerCase().includes(query);
      return matchName || matchCode || matchDial;
    });
  }, [items, searchText]);

  const handleSelect = useCallback(
    (item: DropdownItem<CountryData>) => {
      onChange?.(item.value);
      closeDropdown();
      setSearchText('');
    },
    [onChange, closeDropdown]
  );

  const handleClear = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const triggerLabel = useMemo(() => {
    if (!selectedCountry) return undefined;
    const parts: string[] = [];
    if (showFlag) parts.push(selectedCountry.flag);
    parts.push(selectedCountry.name);
    if (showDialCode) parts.push(`(${selectedCountry.dialCode})`);
    return parts.join(' ');
  }, [selectedCountry, showFlag, showDialCode]);

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
          hasValue={!!selectedCountry}
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
        title={modalTitle}
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
          selectedValues={selectedCountry ? [selectedCountry] : []}
          onSelect={handleSelect}
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
  flagIcon: {
    fontSize: 20,
    marginRight: 6,
  },
});
