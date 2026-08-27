import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  View,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Typography from '@components/ui/Typography';
import ShopInput from '@components/ui/ShopInput';
import ShopButton from '@components/ui/ShopButton';
import { COLORS, SIZES } from '@constants/theme';
import { useTheme } from '@contexts/ThemeContext';
import { useCountdown } from '@hooks/useCountdown';
import {
  STUDENT,
  WATERMARK,
  VARIANT,
  BANNER_IMAGE_ID,
  FLASH_SECONDS,
} from '@constants/student';
import {
  fetchProducts,
  formatVnd,
  type Product,
  type CategoryId,
} from '@services/productApi';

const BASE_CHIPS: { id: CategoryId; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'food', label: 'Đồ ăn' },
  { id: 'drink', label: 'Nước' },
  { id: 'study', label: 'Học tập' },
];

type Status = 'loading' | 'ready' | 'error';

const ProductCard = memo(function ProductCard({
  item,
  surface,
  textColor,
  disabled,
  onOrder,
}: {
  item: Product;
  surface: string;
  textColor: string;
  disabled: boolean;
  onOrder: (p: Product) => void;
}) {
  return (
    <Pressable
      onPress={() => onOrder(item)}
      style={[styles.card, { backgroundColor: surface }]}>
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />

      <View style={styles.cardInfo}>
        <Typography variant="h2" color={textColor} numberOfLines={2}>
          {item.name}
        </Typography>
        <Typography variant="price" color={COLORS.primary}>
          {formatVnd(item.price)}
        </Typography>
        <Typography variant="caption" color={COLORS.textLight}>
          {item.categoryLabel}
        </Typography>
      </View>

      <ShopButton
        title="Đặt"
        onPress={() => onOrder(item)}
        disabled={disabled}
        style={styles.orderBtn}
      />
    </Pressable>
  );
});

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
  const { colors, toggleTheme } = useTheme();
  const { mmss, isExpired } = useCountdown(FLASH_SECONDS);

  const [status, setStatus] = useState<Status>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<CategoryId>('all');
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    let alive = true;
    setStatus('loading');

    fetchProducts()
      .then(list => {
        if (alive) {
          setProducts(list);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (alive) setStatus('error');
      });

    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey(k => k + 1), []);
  const openOrder = useCallback((p: Product) => setSelected(p), []);

  const chips = useMemo(
    () => (VARIANT.chipsReversed ? [...BASE_CHIPS].reverse() : BASE_CHIPS),
    [],
  );

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return products.filter(
      p =>
        (category === 'all' || p.category === category) &&
        (kw === '' || p.name.toLowerCase().includes(kw)),
    );
  }, [products, keyword, category]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        item={item}
        surface={colors.surface}
        textColor={colors.text}
        disabled={isExpired}
        onOrder={openOrder}
      />
    ),
    [colors.surface, colors.text, isExpired, openOrder],
  );

  const header = (
    <View>
      {/* (A) HEADER */}
      <View style={styles.headerRow}>
        <Typography variant="h1" color={COLORS.primary}>
          CAMPUSMART
        </Typography>

        <Pressable onPress={toggleTheme} style={styles.themePill}>
          <Typography variant="caption" color={COLORS.primary}>
            Sáng / Tối
          </Typography>
        </Pressable>
      </View>

      <View style={styles.headerRow}>
        <Typography variant="body" color={COLORS.textLight}>
          Tiện lợi KTX
        </Typography>
        <Typography variant="h2" color={COLORS.secondary}>
          Flash {mmss}
        </Typography>
      </View>

      {/* (B) Ô TÌM */}
      <View style={styles.block}>
        <ShopInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder={`Tìm món, nước, đồ dùng — ${STUDENT.mssv}`}
          backgroundColor={colors.surface}
          textColor={colors.text}
        />
      </View>

      {/* (C) BANNER */}
      <View style={styles.block}>
        <Image
          source={{ uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320` }}
          style={styles.banner}
          resizeMode="cover"
          onError={() => {}}
        />
        <View style={styles.bannerCaption}>
          <Typography variant="h2" color={COLORS.surface}>
            Đặt nhanh · Nhận tại quầy
          </Typography>
        </View>
      </View>

      {/* (D) CHIP */}
      <View style={styles.chipRow}>
        {chips.map(c => {
          const active = c.id === category;
          return (
            <Pressable
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[
                styles.chip,
                { backgroundColor: active ? COLORS.primary : colors.surface },
              ]}>
              <Typography
                variant="caption"
                color={active ? COLORS.surface : COLORS.primary}>
                {c.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}>
      {VARIANT.watermarkAtTop && <WatermarkBar />}

      {status === 'loading' ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Typography variant="body" color={colors.text} style={styles.gapTop}>
            Đang tải món...
          </Typography>
        </View>
      ) : status === 'error' ? (
        <View style={styles.center}>
          <Typography variant="h2" color={COLORS.error}>
            {STUDENT.mssv}
          </Typography>
          <Typography variant="body" color={colors.text} style={styles.gapTop}>
            Không tải được dữ liệu món.
          </Typography>
          <ShopButton title="Thử lại" onPress={retry} style={styles.gapTop} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
          renderItem={renderItem}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <View style={styles.center}>
              <Typography variant="body" color={colors.text}>
                Không có món phù hợp
              </Typography>
            </View>
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
        />
      )}

      {!VARIANT.watermarkAtTop && <WatermarkBar />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.xl },
  gapTop: { marginTop: SIZES.md },
  listContent: { padding: SIZES.lg, paddingBottom: SIZES.xl },
  block: { marginTop: SIZES.md },

  watermark: {
    backgroundColor: COLORS.border,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  themePill: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
  },

  banner: { width: '100%', height: 120, borderRadius: SIZES.radius },
  bannerCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15,118,110,0.55)',
    borderRadius: SIZES.radius,
  },

  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.lg,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    marginTop: SIZES.md,
  },
  cardImage: { width: 64, height: 64, borderRadius: SIZES.sm },
  cardInfo: { flex: 1, paddingHorizontal: SIZES.md },
  orderBtn: { paddingHorizontal: SIZES.lg, paddingVertical: SIZES.sm },
});
