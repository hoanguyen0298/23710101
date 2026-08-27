import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '@components/ui/Typography';
import { COLORS, SIZES } from '@constants/theme';
import { WATERMARK, VARIANT } from '@constants/student';

function WatermarkBar() {
  return (
    <View style={styles.watermark}>
      <Typography variant="caption" color={COLORS.text}>
        {WATERMARK}
      </Typography>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {VARIANT.watermarkAtTop && <WatermarkBar />}

      <View style={styles.body}>
        <Typography variant="h1" color={COLORS.primary}>
          CAMPUSMART
        </Typography>
        <Typography variant="body" color={COLORS.textLight}>
          Tiện lợi KTX
        </Typography>
      </View>

      {!VARIANT.watermarkAtTop && <WatermarkBar />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  watermark: {
    backgroundColor: COLORS.border,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
});
