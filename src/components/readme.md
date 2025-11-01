Tuyệt — mình gom thành **01 file Markdown** gọn, rõ, kéo thả vào Cursor là dùng được ngay. Đã nhấn mạnh quy tắc bạn đang áp dụng (TS, Tailwind, alias `@/`, pattern `alert-{part}-{type}`, không `any`, v.v.).

---

# Frontend Component Standards & Docs (Cursor Rules)

> **Làm luôn một lần, không có dừng lại.**
> Áp dụng cho toàn bộ component trong `src/components`.

## Mandatory Process When Creating a Component

1. **Create** the component theo tiêu chuẩn bên dưới.
2. **Write docs** theo mục “Docs Writing Guide”.
3. **Run checklist** trước khi commit/PR (mục “Quick Pre-Commit Checklist”).

---

## React Component Standards

### General Principles

* **ES6 + TypeScript**: dùng kiểu rõ ràng, **không dùng `any`**. Nếu bắt buộc tạm thời, để TODO và xử lý kế tiếp.
* **Alias imports**: dùng `@/`, `@data`, `@lib`… thay vì `../../../`.
* **Shared utilities**: hằng/tiện ích chung đặt ở `src/constants`, `src/utils`, `src/lib`.
* **Global CSS**: chỉ import ở `src/main.tsx` hoặc root layout. **Không** import global CSS trong component.
* **No `console.log` trong `src/`** (trừ debug tạm thời và phải xóa trước commit).
* **Ưu tiên map/dictionary** thay vì ternary lồng nhiều tầng.
* **Early return**; chỉ `try/catch` khi thực sự xử lý lỗi.

### Component Structure

* **Vị trí file**: `src/components/<Name>/<Name>.tsx`.
* **Export**:

  * Ưu tiên **named export**: `export const Name = () => …`
  * Chấp nhận **default export** nhưng **phải đặt tên hàm**:
    `export default function Name() { … }` (để stack trace rõ).
* **Props**:

  * Khai báo ngay đầu file:
    `type NameProps = { … }`
  * Set **default values** ngay trong destructuring tham số.
  * **Luôn nhận `className`** và merge bằng `clsx`.
* **Loading/Disabled**:

  * Nếu có `isLoading`, **tự disable** và hiển thị spinner.
  * Dùng `Loading` + map kích cỡ từ `src/constants/sizing.ts`.
* **A11y**:

  * Icon-only **bắt buộc** có `aria-label` (có dev-guard cảnh báo trong DEV).
  * Heading/description nên liên kết bằng `aria-labelledby`/`aria-describedby` khi phù hợp.
* **Phân tách render**:

  * Nếu render nhánh phức tạp → tạo `NameContent` để giảm branch ở component chính.

### Controlled vs Uncontrolled (nếu áp dụng)

* Controlled: `value`/`open` + `onChange`/`onOpenChange`.
* Uncontrolled: `defaultValue`/`defaultOpen` (state nội bộ).
* **Không trộn** hành vi giữa hai mode; luôn gọi handler khi state đổi ở uncontrolled.

### Tailwind / CSS

* Dùng **class hợp lệ** (vd: `break-words`, không dùng `overflow-wrap-anywhere`).
* Layout cao tối thiểu: `min-h-dvh` (hoặc `min-h-screen` nếu cần).
* Custom utility: định nghĩa tại `@layer components` + `@apply`, rồi dùng ở component.

### Naming & Folders

* Thư mục component PascalCase: `src/components/Button/Button.tsx`.
* Tài liệu/ demo kèm theo component:

  * `src/components/<Name>/docs.mdx`
  * `src/components/<Name>/<name>.demos.tsx`
* Route docs/slugs: **lowercase** (vd: `button`, `dialog`).

---

## Small Utilities (khuyến nghị dùng chung)

### 1) Helper sinh class theo **pattern biến thể**

> Dùng khi hệ class **ổn định** theo pattern (ví dụ `alert-variant-*`, `alert-icon-*`, `alert-dismiss-*`)

```ts
// src/utils/variant.ts
export type VariantPart = 'variant' | 'icon' | 'dismiss'

export function variantClass(part: VariantPart, type: string) {
  return `alert-${part}-${type}`
}
```

### 2) Dev-guard bắt buộc `aria-label` cho icon-only

```ts
// src/utils/devGuard.ts
export function warnIfIconOnlyWithoutLabel(
  isIconOnly: boolean,
  props: Record<string, unknown>,
  componentName: string
) {
  try {
    const isDev =
      (typeof import.meta !== 'undefined' &&
        (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) ?? false
    if (isDev && isIconOnly && !('aria-label' in props)) {
      // eslint-disable-next-line no-console
      console.warn(`${componentName}: icon-only requires aria-label`)
    }
  } catch {}
}
```

---

## Component Templates

### A) Button (mẫu chuẩn – có loading, icon-only guard)

```tsx
import clsx from 'clsx'
import Loading from '@/components/Loading/Loading'
import { buttonToSpinnerSize } from '@/constants/sizing'
import { warnIfIconOnlyWithoutLabel } from '@/utils/devGuard'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  value?: string
  isLoading?: boolean
  loadingText?: string
}

function ButtonContent({
  icon,
  value,
  children,
  isLoading,
  loadingText,
  size = 'md',
}: Pick<ButtonProps, 'icon' | 'value' | 'children' | 'isLoading' | 'loadingText' | 'size'>) {
  if (isLoading) {
    return (
      <>
        <Loading className="mr-2 inline-flex" size={buttonToSpinnerSize[size]} />
        {loadingText ?? value ?? children ?? 'Loading'}
      </>
    )
  }
  return (
    <>
      {icon && value && (
        <>
          <span className="mr-2">{icon}</span>
          {value}
        </>
      )}
      {icon && !value && !children && icon}
      {value && !icon && value}
      {children}
    </>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  value,
  isLoading = false,
  loadingText,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isIconOnly = !!icon && !value && !children
  warnIfIconOnlyWithoutLabel(isIconOnly, rest, 'Button')

  return (
    <button
      {...rest}
      type={rest.type ?? 'button'}
      disabled={rest.disabled || isLoading}
      className={clsx(
        'btn',
        `btn-${variant}`,
        isIconOnly ? `btn-icon-${size}` : `btn-${size}`,
        className,
        isLoading && 'opacity-80 cursor-not-allowed'
      )}
    >
      <ButtonContent
        icon={icon}
        value={value}
        isLoading={isLoading}
        loadingText={loadingText}
        size={size}
      >
        {children}
      </ButtonContent>
    </button>
  )
}
```

### B) Alert (phiên bản **rút gọn** theo pattern đã “đóng băng”)

```tsx
import React from 'react'
import clsx from 'clsx'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import type { AlertType, AlertProps } from '@/components/Alert/types'
import { useCloseAlert } from '@/components/Alert/alert.hook'
import { variantClass as v } from '@/utils/variant'

const Icons: Record<AlertType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

export default function Alert({
  type = 'info',
  message = '',
  heading,
  dismissible = true,
  icon, // undefined: default; false: none; ReactNode: custom
  onDismiss,
  className,
  children,
  ...rest
}: AlertProps) {
  const { open, handleDismiss } = useCloseAlert(dismissible, onDismiss)
  if (!open) return null

  const DefaultIcon = Icons[type]
  const showIcon = icon !== false
  const role = (type === 'error' || type === 'warning') ? 'alert' : 'status'

  return (
    <div
      {...rest}
      role={role}
      className={clsx('alert-root', v('variant', type), dismissible && 'alert-root--dismissible', className)}
      data-variant={type}
      data-dismissible={dismissible ? '' : undefined}
    >
      <div className="flex items-center">
        {showIcon && (
          <div className="alert-icon-wrap">
            {icon ?? <DefaultIcon className={clsx('w-8 h-8 alert-icon', v('icon', type))} />}
          </div>
        )}

        <div className="ml-3 flex-1">
          {heading && <h3 className="text-sm font-medium leading-5 mb-0">{heading}</h3>}
          {message && <p className="text-sm leading-5 m-0">{message}</p>}
          {children && <div className="text-sm leading-5">{children}</div>}
        </div>

        {dismissible && (
          <div className="ml-3 flex-shrink-0 flex items-center">
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss alert"
              className={clsx(
                'inline-flex h-14 w-14 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                v('icon', type),
                v('dismiss', type)
              )}
            >
              <XMarkIcon className="w-7 h-7 block pointer-events-none" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

> Ghi chú: Vì các biến thể **đã “đóng băng”** và tuân thủ pattern, cách này **gọn nhất** và không đánh đổi khả năng bảo trì.

---

## Quick Pre-Commit Checklist

* [ ] Alias imports, **không** `../../..` trong code mới/sửa.
* [ ] Không import global CSS trong component.
* [ ] Không còn `console.log` trong `src/`.
* [ ] Không dùng `any`; dùng union/guards rõ ràng.
* [ ] Không ternary lồng nhiều tầng (nên dùng map).
* [ ] Icon-only Button có `aria-label` (dev-guard đã cảnh báo).
* [ ] `className` được merge qua `clsx`.
* [ ] Icon import từ `@heroicons/react` (tránh inline SVG nếu không cần).
* [ ] Ví dụ import component ghi rõ đường dẫn: `@/components/<Name>/<Name>`.

---

## Docs Writing Guide (MDX-based)

**Cấu trúc mỗi component**

```
src/components/<Name>/<Name>.tsx
src/components/<Name>/docs.mdx
src/components/<Name>/<name>.demos.tsx
```

**Authoring MDX**

* MDX có thể import và render component, demo trực tiếp.
* **Dùng fenced code block** chuẩn (`ts, `tsx, ```json, …). **Không** tạo `Code` component dùng chung cho docs.
* Copy-to-clipboard nếu cần: làm nhỏ gọn cục bộ trong MDX (không global).
* Syntax highlighting do pipeline MDX/remark/rehype hoặc global styles đảm nhiệm.

**Ví dụ MDX**

````mdx
import { Button } from '@/components/Button/Button'
import { ButtonVariantsDemo } from '@/components/Button/button.demos'
import { PlusIcon } from '@heroicons/react/24/outline'

# Button

## Usage
```tsx
<Button variant="primary" aria-label="Confirm">Confirm</Button>
````

## Examples

<ButtonVariantsDemo />

## Icons

```tsx
import { XMarkIcon } from '@heroicons/react/20/solid'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
```

```

**Routing**

- Docs load động tại `/samples/<slug>` với `<slug>` là thư mục **lowercase** (`button`, `dialog`, …).
- **Không** cần sửa registry; route tự resolve từ file.

**Samples index & navigation**

- Trang `/samples` lấy dữ liệu từ `@data/sample-data.mock.ts`.  
  Thêm/bớt item tại đây để đổi danh sách hiển thị. (Routing docs vẫn tự động)

**Demos**

- Demo nhỏ, tập trung: đặt trong `<name>.demos.tsx`, rồi import vào MDX.
- **Không** dùng demo registry.

**Props Table (tùy chọn)**

- Khuyến nghị auto-gen (vd: `react-docgen-typescript`) → render bởi `PropsTable`.
- Nếu viết tay: dùng bảng Markdown; **không** dùng `any`.

**A11y & code blocks**

- Ví dụ icon-only **phải có** `aria-label`.
- Ghi đúng ngôn ngữ code fence (`tsx`, `ts`, `json`, …).

**Typography isolation**

- Docs dùng Tailwind Typography. Để **không** ảnh hưởng component nhúng, thêm `className="not-prose"` cho wrapper hoặc dùng remark plugin auto add.

---

## PR Review Checklist (dành cho reviewer)

- [ ] Component tuân thủ cấu trúc folder/file và export.
- [ ] Props rõ ràng, không `any`, có default hợp lý.
- [ ] A11y hợp lệ (aria-label khi icon-only, role/labelledby/describedby nếu cần).
- [ ] Không import global CSS trong component.
- [ ] Không còn debug log.
- [ ] Tailwind class hợp lệ; custom utility nằm trong `@layer components`.
- [ ] Controlled/uncontrolled hoạt động đúng và nhất quán.
- [ ] Docs/demos tồn tại và chạy được tại `/samples/<slug>`.
- [ ] Ví dụ code trong docs **khớp** API thực tế.

---

## Ghi chú triển khai nhanh

- Khi hệ biến thể đã ổn định (ví dụ Alert):  
  → Dùng **pattern class** + helper `variantClass()` để rút gọn và tránh lệch key.
- Nếu sau này có **ngoại lệ nhỏ** theo type (vd: warning thêm `ring-2`):  
  → Tạo **override map** cục bộ hoặc thêm utility class trong CSS, **không** quay lại 3 object map rườm rà.
