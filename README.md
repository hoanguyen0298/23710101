NGUYEN HONG PHUC — MSSV 23710101 — https://github.com/hoanguyen0298/23710101.git — stamp #647760

# CampusMart_23710101

Kiểm tra thực hành 1 — Lập trình cho thiết bị di động (TH) — IUH, Khoa CN Điện tử.

## Định danh

| Mục | Giá trị |
| --- | --- |
| Họ tên | NGUYEN HONG PHUC |
| MSSV | 23710101 |
| Stamp | #647760 |
| Repo (clone HTTPS) | https://github.com/hoanguyen0298/23710101.git |

Dòng tên hiện trên Home và trong Modal:

```
TH1 · 23710101 · NGUYEN HONG PHUC · #647760
```

## Chạy trên máy ảo

```sh
npm install
npm start
npm run android
```

## Cây thư mục

```
CampusMart_23710101/
├── README.md
├── App.tsx
├── package.json          (name: campusmart-23710101)
├── babel.config.js       (module-resolver: alias @constants, @components, ...)
├── tsconfig.json         (paths khớp babel)
├── docs/screenshot-th1.png
└── src/
    ├── constants/student.ts
    ├── constants/theme.ts
    ├── contexts/ThemeContext.tsx
    ├── hooks/useCountdown.ts
    ├── services/productApi.ts
    ├── components/ui/Typography.tsx
    ├── components/ui/ShopInput.tsx
    ├── components/ui/ShopButton.tsx
    └── screens/HomeScreen.tsx
```

## Nội dung theo từng câu

**Câu 1** — RN CLI + TypeScript, path alias (babel + tsconfig), `student.ts`
(2 ô thật + seed + VARIANT + examStamp), `theme.ts` (COLORS / SIZES / FONTS),
`App.tsx` bọc SafeAreaProvider → ThemeProvider → HomeScreen.
Ba atom: `Typography`, `ShopInput`, `ShopButton` — StyleSheet.create + memo.

**Câu 2** — Home đủ khối (0)(A)(B)(C)(D)(E). `fetchProducts` dùng `fetch`
(`GET https://fakestoreapi.com/products?limit=8`, kiểm tra `res.ok`), gọi trong
`useEffect` có cleanup bằng cờ `alive`. Ba trạng thái: đang tải / có dữ liệu /
lỗi mạng + nút Thử lại. FlatList có `keyExtractor` ghép MSSV, `ListEmptyComponent`
riêng cho "Không có món phù hợp". Lọc tên + loại bằng `useMemo`, card `memo` +
`useCallback`.

**Câu 3** — Modal `transparent` animationType `fade`, số lượng bằng `useReducer`
(ADD / REMOVE / RESET, trừ không xuống dưới 1), xác nhận → `Alert` có MSSV, họ tên,
stamp, tên món, số lượng, xong thì đóng Modal và reset về 1; Đóng không Alert.
`ThemeContext` + `ThemeProvider`, `useTheme()` gọi ngoài Provider thì `throw`.
`useCountdown(FLASH_SECONDS)` — hết giờ khóa nút Đặt và nút Xác nhận, hiện
"Hết giờ flash-sale".

## Ảnh máy ảo

`docs/screenshot-th1.png`
