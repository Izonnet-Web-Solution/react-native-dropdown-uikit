import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { CommonDropdownProps } from '../../types/props';
import { GroupedItem, DropdownItem } from '../../types/item';
import { useDropdown } from '../../hooks/useDropdown';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownTrigger } from '../common/DropdownTrigger';
import { SearchInput } from '../common/SearchInput';
import { PresentationWrapper } from '../presentation/PresentationWrapper';

export interface GroupedDropdownProps<T = any>
  extends Omit<CommonDropdownProps<T>, 'items'> {
  groups: GroupedItem<T>[];
  value?: T | null;
  onChange?: (value: T | null, item?: DropdownItem<T>) => void;
  stickySectionHeaders?: boolean;
  searchable?: boolean;
  sectionHeaderStyle?: StyleProp<ViewStyle>;
  sectionHeaderTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function GroupedDropdown<T = any>({
  groups,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search in categories...',
  presentation = 'popover',
  placement = 'auto',
  disabled = false,
  clearable = true,
  stickySectionHeaders = true,
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
  sectionHeaderStyle,
  sectionHeaderTextStyle,
  maxHeight = 320,
  itemHeight = 48,
  renderLeftIcon,
  renderRightIcon,
  emptyText = 'No matching options',
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
}: GroupedDropdownProps<T>) {
  const { theme } = useTheme();
  const { flexDirection, textAlign } = useRTL();
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
    for (const group of groups) {
      const match = group.data.find(
        (item) => JSON.stringify(item.value) === JSON.stringify(value)
      );
      if (match) return match;
    }
    return undefined;
  }, [groups, value]);

  const filteredGroups = useMemo(() => {
    if (!searchable || !searchText.trim()) return groups;
    const query = searchText.trim().toLowerCase();

    return groups
      .map((group) => {
        const matchingItems = group.data.filter((item) => {
          const matchLabel = item.label.toLowerCase().includes(query);
          const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(query) : false;
          return matchLabel || matchSubtitle;
        });

        const isGroupMatch = group.title.toLowerCase().includes(query);

        return {
          ...group,
          data: isGroupMatch ? group.data : matchingItems,
        };
      })
      .filter((group) => group.data.length > 0);
  }, [groups, searchText, searchable]);

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
          <SectionList
            sections={filteredGroups}
            keyExtractor={(item, index) => `${String(item.value)}-${index}`}
            stickySectionHeadersEnabled={stickySectionHeaders}
            renderSectionHeader={({ section: { title } }) => (
              <View
                style={[
                  styles.sectionHeader,
                  {
                    backgroundColor: theme.background,
                    borderBottomColor: theme.divider,
                    flexDirection,
                  },
                  sectionHeaderStyle,
                ]}
              >
                <Text
                  style={[
                    styles.sectionHeaderText,
                    {
                      color: theme.textSecondary,
                      fontSize: theme.fontSizeSm,
                      textAlign,
                    },
                    sectionHeaderTextStyle,
                  ]}
                >
                  {title.toUpperCase()}
                </Text>
              </View>
            )}
            renderItem={({ item }) => {
              const isSelected = JSON.stringify(item.value) === JSON.stringify(value);

              return (
                <TouchableOpacity
                  style={[
                    styles.itemRow,
                    {
                      height: itemHeight || theme.itemHeight,
                      borderBottomColor: theme.divider,
                      flexDirection,
                    },
                    isSelected && { backgroundColor: theme.primaryLight },
                    item.disabled && styles.disabledRow,
                    itemStyle,
                  ]}
                  onPress={() => !item.disabled && handleSelect(item)}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  {item.icon ? (
                    <View style={styles.iconContainer}>
                      {typeof item.icon === 'function'
                        ? item.icon({
                            color: isSelected ? theme.primary : theme.text,
                            size: 20,
                          })
                        : item.icon}
                    </View>
                  ) : null}

                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.itemLabel,
                        {
                          color: item.disabled
                            ? theme.textPlaceholder
                            : isSelected
                            ? theme.primary
                            : theme.text,
                          fontSize: theme.fontSizeMd,
                          fontWeight: isSelected ? '600' : '400',
                          textAlign,
                        },
                        itemTextStyle,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    {item.subtitle ? (
                      <Text
                        style={[
                          styles.itemSubtitle,
                          {
                            color: theme.textSecondary,
                            fontSize: theme.fontSizeSm,
                            textAlign,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.subtitle}
                      </Text>
                    ) : null}
                  </View>

                  {isSelected ? (
                    <Text style={[styles.checkMark, { color: theme.primary }]}>
                      ✓
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            }}
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
        )}
      </PresentationWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeaderText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  itemRow: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  itemLabel: {
    fontWeight: '400',
  },
  itemSubtitle: {
    marginTop: 2,
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  disabledRow: {
    opacity: 0.5,
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

