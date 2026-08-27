import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
  memo,
} from 'react';
import {
  View,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  Modal,
  Alert,
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
  examStamp,
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

/* ---------- (0) Dòng tên — luôn hiện trên Home và trong Modal ---------- */

const WatermarkBar = memo(function WatermarkBarBase({
  surface,
  textColor,
  borderColor,
}: {
  surface: string;
  textColor: string;
  borderColor: string;
}) {
  return (
    <View
      style={[
        styles.watermark,
        { backgroundColor: surface, borderBottomColor: borderColor },
      ]}>
      <Typography variant="caption" color={textColor}>
        {WATERMARK}
      </Typography>
    </View>
  );
});

/* ---------- (E) Một dòng món trong FlatList ---------- */

const ProductCard = memo(function ProductCardBase({
  item,
  surface,
  textColor,
  subColor,
  disabled,
  onOrder,
}: {
  item: Product;
  surface: string;
  textColor: string;
  subColor: string;
  disabled: boolean;
  onOrder: (p: Product) => void;
}) {
  const handlePress = useCallback(() => onOrder(item), [item, onOrder]);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.card, { backgroundColor: surface }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardInfo}>
        <Typography variant="h2" color={textColor} numberOfLines={2}>
          {item.name}
        </Typography>
        <Typography variant="price" color={COLORS.primary}>
          {formatVnd(item.price)}
        </Typography>
        <Typography variant="caption" color={subColor}>
          {item.categoryLabel}
        </Typography>
      </View>

      <ShopButton
        title="Đặt"
        onPress={handlePress}
        disabled={disabled}
        style={styles.orderBtn}
      />
    </Pressable>
  );
});

/* ---------- Câu 3a: số lượng bằng useReducer (ADD / REMOVE) ---------- */

type QtyAction = { type: 'ADD' } | { type: 'REMOVE' } | { type: 'RESET' };

function qtyReducer(state: number, action: QtyAction): number {
  switch (action.type) {
    case 'ADD':
      return state + 1;
    case 'REMOVE':
      // Bấm trừ khi đang 1 thì vẫn 1
      return state > 1 ? state - 1 : 1;
    case 'RESET':
      return 1;
    default:
      return state;
  }
}

/* ---------- Giao diện 2: hộp Đặt món ---------- */

function OrderModal({
  product,
  colors,
  isExpired,
  onClose,
}: {
  product: Product | null;
  colors: typeof COLORS;
  isExpired: boolean;
  onClose: () => void;
}) {
  const [qty, dispatch] = useReducer(qtyReducer, 1);

  const confirm = useCallback(() => {
    if (!product) {
      return;
    }
    Alert.alert(
      `CampusMart · ${STUDENT.mssv}`,
      `${STUDENT.hoTen} (#${examStamp()}) đã ghi nhận: ${product.name} × ${qty}. Nhận tại quầy KTX.`,
      [
        {
          text: 'Xong',
          onPress: () => {
            dispatch({ type: 'RESET' });
            onClose();
          },
        },
      ],
    );
  }, [product, qty, onClose]);

  const close = useCallback(() => {
    dispatch({ type: 'RESET' });
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={!!product}
      transparent
      animationType={VARIANT.modalAnimation}
      onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* (0) dòng tên trong Modal */}
          <WatermarkBar
            surface={colors.background}
            textColor={colors.text}
            borderColor={colors.border}
          />

          <Typography
            variant="caption"
            color={COLORS.primary}
            style={styles.sheetTag}>
            Giao diện 2
          </Typography>

          {!!product && (
            <>
              <Image
                source={{ uri: product.image }}
                style={styles.sheetImage}
                resizeMode="cover"
                onError={() => {}}
              />

              <Typography
                variant="h2"
                color={colors.text}
                numberOfLines={2}
                style={styles.centerText}>
                {product.name}
              </Typography>

              <Typography
                variant="price"
                color={COLORS.primary}
                style={styles.centerText}>
                {formatVnd(product.price)}
              </Typography>

              <Typography
                variant="caption"
                color={colors.textLight}
                style={styles.centerText}>
                Danh mục: {product.categoryLabel}
              </Typography>

              <Typography
                variant="caption"
                color={colors.textLight}
                numberOfLines={2}
                style={styles.centerText}>
                {product.description}
              </Typography>

              {/* − / số / + */}
              <View style={styles.qtyRow}>
                <Pressable
                  onPress={() => dispatch({ type: 'REMOVE' })}
                  style={[styles.qtyBtn, styles.qtyBtnOutline]}>
                  <Typography variant="h2" color={COLORS.primary}>
                    −
                  </Typography>
                </Pressable>

                <Typography
                  variant="h2"
                  color={colors.text}
                  style={styles.qtyText}>
                  {qty}
                </Typography>

                <Pressable
                  onPress={() => dispatch({ type: 'ADD' })}
                  style={[styles.qtyBtn, styles.qtyBtnFilled]}>
                  <Typography variant="h2" color={COLORS.surface}>
                    +
                  </Typography>
                </Pressable>
              </View>

              {isExpired && (
                <Typography
                  variant="caption"
                  color={COLORS.error}
                  style={styles.centerText}>
                  Hết giờ flash-sale
                </Typography>
              )}

              <ShopButton
                title="Xác nhận đặt"
                onPress={confirm}
                disabled={isExpired}
                style={styles.sheetBtn}
              />
              <ShopButton
                title="Đóng"
                onPress={close}
                variant="outline"
                style={styles.sheetBtn}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Màn Home ---------- */

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
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
        if (alive) {
          setStatus('error');
        }
      });

    return () => {
      alive = false;
    };
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey(k => k + 1), []);
  const openOrder = useCallback((p: Product) => setSelected(p), []);
  const closeOrder = useCallback(() => setSelected(null), []);

  const chips = useMemo(
    () => (VARIANT.chipsReversed ? [...BASE_CHIPS].reverse() : BASE_CHIPS),
    [],
  );

  // Lọc tên + loại bằng useMemo — gõ không gọi lại API
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
        subColor={colors.textLight}
        disabled={isExpired}
        onOrder={openOrder}
      />
    ),
    [colors.surface, colors.text, colors.textLight, isExpired, openOrder],
  );

  const header = (
    <View>
      {/* (A) HEADER */}
      <View style={styles.headerRow}>
        <Typography variant="h1" color={COLORS.primary}>
          CAMPUSMART
        </Typography>

        {/* Số cuối MSSV = 1 → nút Pressable (không dùng Switch) */}
        <Pressable onPress={toggleTheme} style={styles.themePill}>
          <Typography
            variant="caption"
            color={isDark ? colors.text : COLORS.primary}>
            {isDark ? 'Tối / Sáng' : 'Sáng / Tối'}
          </Typography>
        </Pressable>
      </View>

      <View style={styles.headerRow}>
        <Typography variant="body" color={colors.textLight}>
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
          <Typography variant="caption" color={COLORS.surface}>
            Cửa hàng tiện lợi ký túc xá 24/7
          </Typography>
        </View>
      </View>

      {/* (D) CHIP — số cuối lẻ → thứ tự đảo */}
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
                color={
                  active ? COLORS.surface : isDark ? colors.text : COLORS.primary
                }>
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
      {VARIANT.watermarkAtTop && (
        <WatermarkBar
          surface={colors.surface}
          textColor={colors.text}
          borderColor={colors.border}
        />
      )}

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
            <View style={styles.empty}>
              <Typography variant="body" color={colors.text}>
                Không có món phù hợp
              </Typography>
            </View>
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Số cuối MSSV = 1 → dòng tên nằm dưới chân màn */}
      {!VARIANT.watermarkAtTop && (
        <WatermarkBar
          surface={colors.surface}
          textColor={colors.text}
          borderColor={colors.border}
        />
      )}

      <OrderModal
        product={selected}
        colors={colors}
        isExpired={isExpired}
        onClose={closeOrder}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  empty: { alignItems: 'center', paddingVertical: SIZES.xl },
  gapTop: { marginTop: SIZES.md },
  listContent: { padding: SIZES.lg, paddingBottom: SIZES.xl },
  block: { marginTop: SIZES.md },

  watermark: {
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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

  /* Modal */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  sheet: {
    borderRadius: SIZES.radius,
    paddingBottom: SIZES.lg,
    overflow: 'hidden',
  },
  sheetTag: {
    alignSelf: 'flex-end',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.sm,
  },
  sheetImage: {
    width: '100%',
    height: 180,
    marginTop: SIZES.sm,
  },
  centerText: {
    textAlign: 'center',
    paddingHorizontal: SIZES.lg,
    marginTop: SIZES.xs,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.lg,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radiusPill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnOutline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  qtyBtnFilled: { backgroundColor: COLORS.primary },
  qtyText: { marginHorizontal: SIZES.lg, minWidth: 24, textAlign: 'center' },
  sheetBtn: { marginHorizontal: SIZES.lg, marginTop: SIZES.sm },
});
