import React, { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { CommonDropdownProps } from '../../types/props';
import { DropdownItem } from '../../types/item';
import { useDropdown } from '../../hooks/useDropdown';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownTrigger } from '../common/DropdownTrigger';
import { DropdownList } from '../common/DropdownList';
import { PresentationWrapper } from '../presentation/PresentationWrapper';

export interface CustomDropdownProps<T = any> extends CommonDropdownProps<T> {
  value?: T | null;
  onChange?: (value: T | null, item?: DropdownItem<T>) => void;
  renderCustomTrigger?: (
    isOpen: boolean,
    selectedItem: DropdownItem<T> | undefined,
    toggle: () => void
  ) => React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function CustomDropdown<T = any>({
  items,
  value,
  onChange,
  placeholder = 'Select option...',
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
  maxHeight = 280,
  itemHeight = 56,
  renderLeftIcon,
  renderRightIcon,
  renderItem,
  renderCustomTrigger,
  emptyText,
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
}: CustomDropdownProps<T>) {
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
    onOpen,
    onClose,
  });

  const selectedItem = useMemo(() => {
    if (value === undefined || value === null) return undefined;
    return items.find((item) => JSON.stringify(item.value) === JSON.stringify(value));
  }, [items, value]);

  const selectedValues = useMemo(() => {
    return value !== undefined && value !== null ? [value] : [];
  }, [value]);

  const handleSelect = useCallback(
    (item: DropdownItem<T>) => {
      onChange?.(item.value, item);
      closeDropdown();
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
        {renderCustomTrigger ? (
          <View ref={triggerRef} collapsable={false}>
            <TouchableOpacity
              onPress={toggleDropdown}
              disabled={disabled}
              activeOpacity={0.8}
            >
              {renderCustomTrigger(isOpen, selectedItem, toggleDropdown)}
            </TouchableOpacity>
          </View>
        ) : (
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
        )}
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
        <DropdownList
          items={items}
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

