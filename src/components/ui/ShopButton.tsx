import React, { memo } from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  style?: StyleProp<ViewStyle>;
};

function ShopButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  style,
}: Props) {
  const isOutline = variant === 'outline';
  const locked = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      style={({ pressed }) => [
        styles.base,
        isOutline ? styles.outline : styles.primary,
        locked && styles.locked,
        pressed && !locked && styles.pressed,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.surface} />
      ) : (
        <Typography variant="h2" color={isOutline ? COLORS.primary : COLORS.surface}>
          {title}
        </Typography>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primary: { backgroundColor: COLORS.primary },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  locked: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
});

export default memo(ShopButton);
