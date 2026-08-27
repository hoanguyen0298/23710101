import React, { memo } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { FONTS, COLORS } from '@constants/theme';

type Props = {
  variant?: keyof typeof FONTS;
  color?: string;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

function Typography({
  variant = 'body',
  color = COLORS.text,
  numberOfLines,
  style,
  children,
}: Props) {
  return (
    <Text numberOfLines={numberOfLines} style={[FONTS[variant], { color }, style]}>
      {children}
    </Text>
  );
}

export default memo(Typography);
