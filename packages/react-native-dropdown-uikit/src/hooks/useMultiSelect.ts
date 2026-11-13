import { useState, useCallback } from 'react';

export interface UseMultiSelectOptions<T> {
  initialValues?: T[];
  maxSelect?: number;
  onSelectionChange?: (values: T[]) => void;
}

export interface UseMultiSelectReturn<T> {
  selectedValues: T[];
  isSelected: (value: T) => boolean;
  toggleItem: (value: T) => boolean;
  selectAll: (values: T[]) => void;
  clearAll: () => void;
  removeItem: (value: T) => void;
  setSelectedValues: (values: T[]) => void;
}

export function useMultiSelect<T = any>(
  options: UseMultiSelectOptions<T> = {}
): UseMultiSelectReturn<T> {
  const { initialValues = [], maxSelect, onSelectionChange } = options;
  const [selectedValues, setSelectedValuesState] = useState<T[]>(initialValues);

  const setSelectedValues = useCallback(
    (newValues: T[]) => {
      setSelectedValuesState(newValues);
      onSelectionChange?.(newValues);
    },
    [onSelectionChange]
  );

  const isSelected = useCallback(
    (value: T): boolean => {
      return selectedValues.some((v) => JSON.stringify(v) === JSON.stringify(value));
    },
    [selectedValues]
  );

  const toggleItem = useCallback(
    (value: T): boolean => {
      const exists = selectedValues.some((v) => JSON.stringify(v) === JSON.stringify(value));
      let updated: T[];

      if (exists) {
        updated = selectedValues.filter((v) => JSON.stringify(v) !== JSON.stringify(value));
      } else {
        if (maxSelect !== undefined && selectedValues.length >= maxSelect) {
          return false;
        }
        updated = [...selectedValues, value];
      }

      setSelectedValues(updated);
      return true;
    },
    [selectedValues, maxSelect, setSelectedValues]
  );

  const selectAll = useCallback(
    (allValues: T[]) => {
      const finalValues =
        maxSelect !== undefined ? allValues.slice(0, maxSelect) : allValues;
      setSelectedValues(finalValues);
    },
    [maxSelect, setSelectedValues]
  );

  const clearAll = useCallback(() => {
    setSelectedValues([]);
  }, [setSelectedValues]);

  const removeItem = useCallback(
    (value: T) => {
      const updated = selectedValues.filter((v) => JSON.stringify(v) !== JSON.stringify(value));
      setSelectedValues(updated);
    },
    [selectedValues, setSelectedValues]
  );

  return {
    selectedValues,
    isSelected,
    toggleItem,
    selectAll,
    clearAll,
    removeItem,
    setSelectedValues,
  };
}

