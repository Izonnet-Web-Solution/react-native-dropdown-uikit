import React from 'react';
import { BasicDropdown, BasicDropdownProps } from '../basic/BasicDropdown';
import { SearchableDropdown, SearchableDropdownProps } from '../searchable/SearchableDropdown';
import { MultiSelectDropdown, MultiSelectDropdownProps } from '../multiSelect/MultiSelectDropdown';
import { CheckboxDropdown, CheckboxDropdownProps } from '../checkbox/CheckboxDropdown';
import { CountryDropdown, CountryDropdownProps } from '../country/CountryDropdown';
import { CascadingDropdown, CascadingDropdownProps } from '../cascading/CascadingDropdown';
import { BottomSheetDropdown, BottomSheetDropdownProps } from '../bottomSheet/BottomSheetDropdown';
import { GroupedDropdown, GroupedDropdownProps } from '../grouped/GroupedDropdown';
import { CustomDropdown, CustomDropdownProps } from '../custom/CustomDropdown';
import { AutocompleteDropdown, AutocompleteDropdownProps } from '../autocomplete/AutocompleteDropdown';

export type DropdownMode =
  | 'basic'
  | 'searchable'
  | 'multi-select'
  | 'checkbox'
  | 'country'
  | 'cascading'
  | 'bottom-sheet'
  | 'grouped'
  | 'custom'
  | 'autocomplete';

export type UniversalDropdownProps<T = any> = {
  mode?: DropdownMode;
} & (
  | ({ mode?: 'basic' } & BasicDropdownProps<T>)
  | ({ mode: 'searchable' } & SearchableDropdownProps<T>)
  | ({ mode: 'multi-select' } & MultiSelectDropdownProps<T>)
  | ({ mode: 'checkbox' } & CheckboxDropdownProps<T>)
  | ({ mode: 'country' } & CountryDropdownProps)
  | ({ mode: 'cascading' } & CascadingDropdownProps<T>)
  | ({ mode: 'bottom-sheet' } & BottomSheetDropdownProps<T>)
  | ({ mode: 'grouped' } & GroupedDropdownProps<T>)
  | ({ mode: 'custom' } & CustomDropdownProps<T>)
  | ({ mode: 'autocomplete' } & AutocompleteDropdownProps<T>)
);

export function Dropdown<T = any>(props: UniversalDropdownProps<T>) {
  const { mode = 'basic', ...restProps } = props;

  switch (mode) {
    case 'searchable':
      return <SearchableDropdown<T> {...(restProps as SearchableDropdownProps<T>)} />;
    case 'multi-select':
      return <MultiSelectDropdown<T> {...(restProps as MultiSelectDropdownProps<T>)} />;
    case 'checkbox':
      return <CheckboxDropdown<T> {...(restProps as CheckboxDropdownProps<T>)} />;
    case 'country':
      return <CountryDropdown {...(restProps as CountryDropdownProps)} />;
    case 'cascading':
      return <CascadingDropdown<T> {...(restProps as CascadingDropdownProps<T>)} />;
    case 'bottom-sheet':
      return <BottomSheetDropdown<T> {...(restProps as BottomSheetDropdownProps<T>)} />;
    case 'grouped':
      return <GroupedDropdown<T> {...(restProps as GroupedDropdownProps<T>)} />;
    case 'custom':
      return <CustomDropdown<T> {...(restProps as CustomDropdownProps<T>)} />;
    case 'autocomplete':
      return <AutocompleteDropdown<T> {...(restProps as AutocompleteDropdownProps<T>)} />;
    case 'basic':
    default:
      return <BasicDropdown<T> {...(restProps as BasicDropdownProps<T>)} />;
  }
}

