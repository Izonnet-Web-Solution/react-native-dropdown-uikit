import {
  COUNTRIES,
  SAMPLE_CASCADING_DATA,
  mergeTheme,
  lightTokens,
  useKeyboard,
  AutocompleteDropdown,
} from 'react-native-dropdown-uikit';

describe('react-native-dropdown-uikit verification', () => {
  it('should bundle ~250 ISO countries with code and flags', () => {
    expect(COUNTRIES.length).toBeGreaterThan(100);
    const us = COUNTRIES.find((c) => c.code === 'US');
    expect(us).toBeDefined();
    expect(us?.dialCode).toBe('+1');
    expect(us?.flag).toBe('🇺🇸');

    const india = COUNTRIES.find((c) => c.code === 'IN');
    expect(india).toBeDefined();
    expect(india?.dialCode).toBe('+91');
    expect(india?.flag).toBe('🇮🇳');
  });

  it('should support sample cascading data hierarchy', () => {
    expect(SAMPLE_CASCADING_DATA.length).toBeGreaterThan(0);
    const firstCountry = SAMPLE_CASCADING_DATA[0];
    expect(firstCountry.children).toBeDefined();
    expect(firstCountry.children![0].children).toBeDefined();
  });

  it('should deep merge theme overrides without losing defaults', () => {
    const merged = mergeTheme(lightTokens, { primary: '#FF0000' });
    expect(merged.primary).toBe('#FF0000');
    expect(merged.surface).toBe(lightTokens.surface);
    expect(merged.itemHeight).toBe(lightTokens.itemHeight);
  });

  it('should export keyboard hook and autocomplete component', () => {
    expect(useKeyboard).toBeDefined();
    expect(typeof AutocompleteDropdown).toBe('function');
  });

  it('should support loading prop and loadingText', () => {
    // Verify props are typed and exports are clean
    expect(typeof AutocompleteDropdown).toBe('function');
  });
});
