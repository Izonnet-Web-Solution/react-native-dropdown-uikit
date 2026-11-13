import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  ListRenderItemInfo,
  ActivityIndicator,
} from 'react-native';
import { DropdownItem } from '../../types/item';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';

export interface DropdownListProps<T = any> {
  items: DropdownItem<T>[];
  selectedValues?: T[];
  onSelect: (item: DropdownItem<T>) => void;
  renderItem?: (item: DropdownItem<T>, isSelected: boolean) => React.ReactNode;
  itemHeight?: number;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  emptyText?: string;
  emptyComponent?: React.ReactNode;
  keyExtractor?: (item: DropdownItem<T>, index: number) => string;
  nested?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingComponent?: React.ReactNode;
}

interface DefaultRowProps<T> {
  item: DropdownItem<T>;
  isSelected: boolean;
  onPress: (item: DropdownItem<T>) => void;
  itemHeight?: number;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
}

const DefaultRow = React.memo(
  <T,>({
    item,
    isSelected,
    onPress,
    itemHeight,
    itemStyle,
    itemTextStyle,
  }: DefaultRowProps<T>) => {
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
          styles.row,
          {
            height: itemHeight || theme.itemHeight,
            borderBottomColor: theme.divider,
            flexDirection,
          },
          isSelected && { backgroundColor: theme.primaryLight },
          item.disabled && styles.disabledRow,
          itemStyle,
        ]}
        onPress={handlePress}
        disabled={item.disabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, disabled: !!item.disabled }}
        accessibilityLabel={`${item.label}${isSelected ? ', selected' : ''}`}
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

        {isSelected ? (
          <View style={styles.checkContainer}>
            <Text style={[styles.checkMark, { color: theme.primary }]}>✓</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
) as <T>(props: DefaultRowProps<T>) => React.ReactElement;

export function DropdownList<T = any>({
  items,
  selectedValues = [],
  onSelect,
  renderItem,
  itemHeight,
  itemStyle,
  itemTextStyle,
  emptyText = 'No options found',
  emptyComponent,
  keyExtractor,
  nested = false,
  loading = false,
  loadingText = 'Loading options...',
  loadingComponent,
}: DropdownListProps<T>) {
  const { theme } = useTheme();

  const isValueSelected = useCallback(
    (value: T) => {
      return selectedValues.some((v) => JSON.stringify(v) === JSON.stringify(value));
    },
    [selectedValues]
  );

  const defaultKeyExtractor = useCallback(
    (item: DropdownItem<T>, index: number) => {
      if (item.value !== undefined && item.value !== null) {
        return `${String(item.value)}-${index}`;
      }
      return `${item.label}-${index}`;
    },
    []
  );

  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;
    return (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  const renderFlatListItem = useCallback(
    ({ item }: ListRenderItemInfo<DropdownItem<T>>) => {
      const selected = isValueSelected(item.value);

      if (renderItem) {
        return (
          <TouchableOpacity
            onPress={() => !item.disabled && onSelect(item)}
            disabled={item.disabled}
          >
            {renderItem(item, selected)}
          </TouchableOpacity>
        );
      }

      return (
        <DefaultRow
          item={item}
          isSelected={selected}
          onPress={onSelect}
          itemHeight={itemHeight}
          itemStyle={itemStyle}
          itemTextStyle={itemTextStyle}
        />
      );
    },
    [isValueSelected, renderItem, onSelect, itemHeight, itemStyle, itemTextStyle]
  );

  const ListEmpty = useMemo(() => {
    if (emptyComponent) return <>{emptyComponent}</>;
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          {emptyText}
        </Text>
      </View>
    );
  }, [emptyComponent, emptyText, theme.textSecondary]);

  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
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
    );
  }

  if (nested) {
    return (
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {items.length === 0 ? (
          ListEmpty
        ) : (
          items.map((item, index) => (
            <React.Fragment
              key={keyExtractor ? keyExtractor(item, index) : defaultKeyExtractor(item, index)}
            >
              {renderFlatListItem({ item, index, separators: {} as any })}
            </React.Fragment>
          ))
        )}
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={renderFlatListItem}
      keyExtractor={keyExtractor || defaultKeyExtractor}
      getItemLayout={getItemLayout}
      ListEmptyComponent={ListEmpty}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={Platform.OS === 'android'}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemLabel: {
    fontWeight: '400',
  },
  itemSubtitle: {
    marginTop: 2,
  },
  checkContainer: {
    marginLeft: 8,
  },
  checkMark: {
    fontSize: 16,
    fontWeight: '700',
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

