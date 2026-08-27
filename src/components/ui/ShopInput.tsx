import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES, FONTS } from '@constants/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  backgroundColor?: string;
  textColor?: string;
};

export default function ShopInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  backgroundColor = COLORS.surface,
  textColor = COLORS.text,
}: Props) {
  return (
    <View style={styles.wrap}>
      {!!label && (
        <Typography variant="caption" color={COLORS.textLight} style={styles.label}>
          {label}
        </Typography>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        autoCapitalize="none"
        style={[
          styles.input,
          { backgroundColor, color: textColor },
          !!error && styles.inputError,
        ]}
      />

      {!!error && (
        <Typography variant="caption" color={COLORS.error} style={styles.label}>
          {error}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: { marginBottom: SIZES.xs },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    ...FONTS.body,
  },
  inputError: { borderColor: COLORS.error },
});
