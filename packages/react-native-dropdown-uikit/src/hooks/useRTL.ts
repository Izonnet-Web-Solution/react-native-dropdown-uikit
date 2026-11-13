import { useMemo } from 'react';
import { I18nManager, TextStyle, ViewStyle } from 'react-native';

export interface UseRTLReturn {
  isRTL: boolean;
  flexDirection: ViewStyle['flexDirection'];
  textAlign: TextStyle['textAlign'];
  iconTransform: { transform: { scaleX: number }[] };
}

export const useRTL = (): UseRTLReturn => {
  const isRTL = I18nManager.isRTL;

  return useMemo(
    () => ({
      isRTL,
      flexDirection: isRTL ? ('row-reverse' as const) : ('row' as const),
      textAlign: isRTL ? ('right' as const) : ('left' as const),
      iconTransform: { transform: [{ scaleX: isRTL ? -1 : 1 }] },
    }),
    [isRTL]
  );
};

