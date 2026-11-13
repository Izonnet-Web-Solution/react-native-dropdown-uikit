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
import { CascadingItem } from '../../types/item';
import { useDropdown } from '../../hooks/useDropdown';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';
import { FormWrapper } from '../common/FormWrapper';
import { DropdownTrigger } from '../common/DropdownTrigger';
import { PresentationWrapper } from '../presentation/PresentationWrapper';

export interface CascadingDropdownProps<T = any>
  extends Omit<CommonDropdownProps<T>, 'items'> {
  data: CascadingItem<T>[];
  value?: T[];
  onChange?: (path: CascadingItem<T>[]) => void;
  separator?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function CascadingDropdown<T = any>({
  data,
  value,
  onChange,
  placeholder = 'Select location...',
  separator = ' > ',
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
  emptyText = 'No options available',
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
}: CascadingDropdownProps<T>) {
  const { theme } = useTheme();
  const { flexDirection, textAlign } = useRTL();

  // Navigation path stack within the tree: array of CascadingItem
  const [navStack, setNavStack] = useState<CascadingItem<T>[]>([]);

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
      setNavStack([]);
      onOpen?.();
    },
    onClose,
  });

  // Current level items
  const currentLevelItems: CascadingItem<T>[] = useMemo(() => {
    if (navStack.length === 0) {
      return data;
    }
    const currentParent = navStack[navStack.length - 1];
    return currentParent.children || [];
  }, [data, navStack]);

  // Find selected path from value prop
  const selectedPath = useMemo(() => {
    if (!value || value.length === 0) return [];

    const path: CascadingItem<T>[] = [];
    let currentPool = data;

    for (const val of value) {
      const match = currentPool.find(
        (item) => JSON.stringify(item.value) === JSON.stringify(val)
      );
      if (match) {
        path.push(match);
        currentPool = match.children || [];
      } else {
        break;
      }
    }
    return path;
  }, [data, value]);

  const triggerLabel = useMemo(() => {
    if (selectedPath.length === 0) return undefined;
    return selectedPath.map((item) => item.label).join(separator);
  }, [selectedPath, separator]);

  const handleSelect = useCallback(
    (item: CascadingItem<T>) => {
      const newPath = [...navStack, item];
      if (item.children && item.children.length > 0) {
        setNavStack(newPath);
      } else {
        // Leaf reached
        onChange?.(newPath);
        closeDropdown();
      }
    },
    [navStack, onChange, closeDropdown]
  );

  const handleBack = useCallback(() => {
    if (navStack.length > 0) {
      setNavStack(navStack.slice(0, -1));
    }
  }, [navStack]);

  const handleClear = useCallback(() => {
    onChange?.([]);
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
          selectedLabel={triggerLabel}
          hasValue={selectedPath.length > 0}
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
        title={
          modalTitle ||
          (navStack.length > 0
            ? navStack[navStack.length - 1].label
            : label || placeholder)
        }
        style={dropdownStyle}
        maxHeight={maxHeight}
      >
        {/* Navigation Breadcrumb Bar */}
        {navStack.length > 0 ? (
          <View
            style={[
              styles.navBar,
              { borderBottomColor: theme.divider, flexDirection },
            ]}
          >
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.backButton, { flexDirection }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={[styles.backIcon, { color: theme.primary }]}>←</Text>
              <Text
                style={[
                  styles.backText,
                  { color: theme.primary, fontSize: theme.fontSizeMd },
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.breadcrumbText,
                { color: theme.textSecondary, fontSize: theme.fontSizeSm },
              ]}
              numberOfLines={1}
            >
              {navStack.map((i) => i.label).join(' / ')}
            </Text>
          </View>
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
          <FlatList
            data={currentLevelItems}
            keyExtractor={(item, index) => `${String(item.value)}-${index}`}
            renderItem={({ item }) => {
              const hasChildren = item.children && item.children.length > 0;
              const isCurrentlySelected = selectedPath.some(
                (p) => JSON.stringify(p.value) === JSON.stringify(item.value)
              );

              return (
                <TouchableOpacity
                  style={[
                    styles.itemRow,
                    {
                      height: itemHeight || theme.itemHeight,
                      borderBottomColor: theme.divider,
                      flexDirection,
                    },
                    isCurrentlySelected && { backgroundColor: theme.primaryLight },
                    item.disabled && styles.disabledRow,
                    itemStyle,
                  ]}
                  onPress={() => !item.disabled && handleSelect(item)}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.itemLabel,
                        {
                          color: item.disabled
                            ? theme.textPlaceholder
                            : isCurrentlySelected
                            ? theme.primary
                            : theme.text,
                          fontSize: theme.fontSizeMd,
                          fontWeight: isCurrentlySelected ? '600' : '400',
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

                  {hasChildren ? (
                    <Text style={[styles.forwardArrow, { color: theme.textSecondary }]}>
                      ›
                    </Text>
                  ) : isCurrentlySelected ? (
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
  navBar: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  backText: {
    fontWeight: '600',
  },
  breadcrumbText: {
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
  itemRow: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  forwardArrow: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
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

