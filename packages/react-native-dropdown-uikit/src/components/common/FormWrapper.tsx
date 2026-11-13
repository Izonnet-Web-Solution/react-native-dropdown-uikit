import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormValidationProps } from '../../types/props';
import { useTheme } from '../../theme/ThemeContext';
import { useRTL } from '../../hooks/useRTL';

export interface FormWrapperProps extends FormValidationProps {
  children: ReactNode;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  label,
  required = false,
  error,
  helperText,
  disabled = false,
  labelStyle,
  errorStyle,
  helperTextStyle,
  children,
}) => {
  const { theme } = useTheme();
  const { flexDirection, textAlign } = useRTL();

  return (
    <View style={styles.container}>
      {label ? (
        <View style={[styles.labelRow, { flexDirection }]}>
          <Text
            style={[
              styles.label,
              {
                color: disabled ? theme.textSecondary : theme.text,
                fontSize: theme.fontSizeMd,
                textAlign,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
          {required ? (
            <Text
              style={[
                styles.requiredAsterisk,
                { color: theme.error, fontSize: theme.fontSizeMd },
              ]}
              accessibilityLabel="required"
            >
              *
            </Text>
          ) : null}
        </View>
      ) : null}

      {children}

      {error ? (
        <Text
          style={[
            styles.messageText,
            { color: theme.error, fontSize: theme.fontSizeSm, textAlign },
            errorStyle,
          ]}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.messageText,
            { color: theme.textSecondary, fontSize: theme.fontSizeSm, textAlign },
            helperTextStyle,
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
  },
  labelRow: {
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  label: {
    fontWeight: '600',
  },
  requiredAsterisk: {
    fontWeight: '700',
    marginLeft: 2,
  },
  messageText: {
    marginTop: 4,
    paddingHorizontal: 2,
  },
});

