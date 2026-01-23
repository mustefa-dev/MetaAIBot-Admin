# MetaAIBot Admin Dashboard - Implementation Plan

## Overview
Build a modern Vue 3/Nuxt 4 admin dashboard for the MetaAIBot customer support system. The dashboard will provide complete management of conversations, orders, products, customers, AI providers, and system settings.

## Tech Stack (Matching Reference)
- **Framework**: Nuxt 4 + Vue 3
- **State Management**: Pinia
- **Styling**: Tailwind CSS with dark mode
- **Charts**: ApexCharts
- **Icons**: Heroicons
- **i18n**: Arabic (primary) + English with RTL support
- **HTTP**: Native $fetch with custom useApi composable

## Project Location
`C:\Users\musta\RiderProjects\MetaAIBot\admin-dashboard\`

---

## Backend API Integration Reference

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Admin login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |
| POST | `/auth/refresh` | Refresh token |

### Dashboard Stats Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Overall statistics |
| GET | `/admin/stats/daily` | Daily stats for charts |
| GET | `/admin/conversations/today` | Today's conversation count |
| GET | `/health/ai-status` | AI provider statuses |
| GET | `/health/detailed` | System health details |

### Conversations Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/conversations` | List all conversations (paginated) |
| GET | `/admin/conversations/{id}` | Get conversation details |
| GET | `/admin/conversations/{id}/messages` | Get conversation messages |
| PATCH | `/admin/conversations/{id}/status` | Update status (handoff, resolved) |
| POST | `/admin/conversations/{id}/reply` | Send manual reply |

### Orders Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List orders (paginated) |
| GET | `/orders/{id}` | Get order details |
| GET | `/orders/number/{orderNumber}` | Get by order number |
| PUT | `/orders/{id}` | Update order |
| PATCH | `/orders/{id}/status` | Update order status |
| DELETE | `/orders/{id}` | Cancel order |
| GET | `/orders/stats` | Order statistics |

### Products Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products |
| GET | `/products/{code}` | Get by code |
| GET | `/products/id/{id}` | Get by ID |
| GET | `/products/category/{categoryId}` | Get by category |
| GET | `/products/search?q=` | Search products |
| GET | `/products/low-stock` | Low stock products |
| GET | `/products/top-selling` | Top selling products |
| POST | `/products` | Create product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| PATCH | `/products/{id}/stock` | Update stock |
| POST | `/products/seed` | Seed sample data |

### Categories Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List categories |
| GET | `/categories/{id}` | Get category |
| POST | `/categories` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |

### Customers Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List customers (paginated) |
| GET | `/customers/{id}` | Get customer details |
| GET | `/customers/{id}/orders` | Get customer orders |
| GET | `/customers/{id}/conversations` | Get customer conversations |
| PUT | `/customers/{id}` | Update customer |
| PATCH | `/customers/{id}/block` | Block/unblock customer |
| GET | `/customers/stats` | Customer statistics |

### Shipping/Governorates Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/shipping/governorates` | List governorates |
| GET | `/shipping/governorates/{id}` | Get governorate |
| PUT | `/shipping/governorates/{id}` | Update (shipping cost) |

### Knowledge Base Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/knowledge` | List knowledge entries |
| GET | `/admin/knowledge/{id}` | Get entry |
| POST | `/admin/knowledge` | Create entry |
| PUT | `/admin/knowledge/{id}` | Update entry |
| DELETE | `/admin/knowledge/{id}` | Delete entry |

### Settings Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get all settings |
| PUT | `/settings` | Update settings |
| GET | `/settings/templates` | Get message templates |
| PUT | `/settings/templates` | Update templates |

### Test Endpoints (Development)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/test/chat` | Simulate conversation |
| POST | `/test/intent` | Test intent detection |
| POST | `/test/ai` | Test AI providers |
| GET | `/test/ai/status` | AI status |
| GET | `/test/samples` | Sample messages |

---

## Implementation Phases

### Phase 1: Project Setup & Core Infrastructure
**Goal**: Set up the Nuxt 4 project with all configurations and base components

#### 1.1 Project Initialization
```
admin-dashboard/
├── app/
│   ├── assets/css/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   ├── stores/
│   ├── types/
│   └── utils/
├── locales/
├── public/
├── nuxt.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

#### 1.2 Files to Create
1. `package.json` - Dependencies
2. `nuxt.config.ts` - Nuxt configuration
3. `tailwind.config.ts` - Tailwind with custom theme
4. `tsconfig.json` - TypeScript config
5. `app/assets/css/main.css` - Base styles + Tailwind
6. `app/assets/css/rtl.css` - RTL overrides
7. `app/app.vue` - Root component
8. `app/error.vue` - Error page

#### 1.3 TypeScript Types
```
app/types/
├── index.ts           # Export all types
├── api.ts             # API response types
├── auth.ts            # Auth types
├── conversation.ts    # Conversation types
├── order.ts           # Order types
├── product.ts         # Product types
├── customer.ts        # Customer types
├── category.ts        # Category types
├── shipping.ts        # Shipping types
├── settings.ts        # Settings types
└── stats.ts           # Statistics types
```

---

### Phase 2: UI Component Library
**Goal**: Build all reusable UI components

#### 2.1 Base UI Components
```
app/components/ui/
├── UiButton.vue       # Button with variants, sizes, loading
├── UiInput.vue        # Text input with validation
├── UiSelect.vue       # Dropdown select
├── UiTextarea.vue     # Multi-line input
├── UiCheckbox.vue     # Checkbox input
├── UiSwitch.vue       # Toggle switch
├── UiRadio.vue        # Radio buttons
├── UiCard.vue         # Card container
├── UiBadge.vue        # Status badges
├── UiAlert.vue        # Alert messages
├── UiModal.vue        # Modal dialog
├── UiDrawer.vue       # Side drawer
├── UiDropdown.vue     # Dropdown menu
├── UiTooltip.vue      # Tooltips
├── UiSpinner.vue      # Loading spinner
├── UiSkeleton.vue     # Loading skeleton
├── UiAvatar.vue       # User avatar
├── UiPagination.vue   # Pagination controls
├── UiTabs.vue         # Tab navigation
├── UiProgress.vue     # Progress bar
├── UiEmptyState.vue   # Empty state display
├── UiToast.vue        # Toast notifications
└── UiConfirmDialog.vue # Confirmation modal
```

#### 2.2 Form Components
```
app/components/form/
├── FormField.vue      # Field wrapper with label/error
├── FormInput.vue      # Input with validation
├── FormSelect.vue     # Select with validation
├── FormTextarea.vue   # Textarea with validation
├── FormCheckbox.vue   # Checkbox field
├── FormSwitch.vue     # Switch field
├── FormDatePicker.vue # Date picker
├── FormFileUpload.vue # File upload
├── FormMultiSelect.vue # Multi-select
└── FormRichText.vue   # Rich text editor
```

#### 2.3 Data Components
```
app/components/data/
├── DataTable.vue      # Main data table
├── DataTableColumn.vue # Column definition
├── DataTableSearch.vue # Search input
├── DataTableActions.vue # Row actions
├── DataTableSkeleton.vue # Loading state
└── DataTableFilters.vue # Filter controls
```

#### 2.4 Chart Components
```
app/components/charts/
├── AreaChart.vue      # Area chart
├── BarChart.vue       # Bar chart
├── LineChart.vue      # Line chart
├── DonutChart.vue     # Donut chart
└── PieChart.vue       # Pie chart
```

#### 2.5 Layout Components
```
app/components/layout/
├── TheSidebar.vue     # Main sidebar
├── SidebarItem.vue    # Sidebar menu item
├── TheHeader.vue      # Top header
├── TheFooter.vue      # Footer
├── PageHeader.vue     # Page title + actions
├── UserMenu.vue       # User dropdown
├── ThemeToggle.vue    # Dark/light toggle
└── LanguageSwitcher.vue # AR/EN switcher
```

---

### Phase 3: State Management & Composables
**Goal**: Implement Pinia stores and Vue composables

#### 3.1 Pinia Stores
```
app/stores/
├── auth.ts            # Authentication state
├── user.ts            # User profile
├── theme.ts           # Dark/light theme
├── locale.ts          # Language (ar/en)
├── sidebar.ts         # Sidebar state
└── notifications.ts   # In-app notifications
```

#### 3.2 Composables
```
app/composables/
├── useApi.ts          # HTTP client with auth
├── useAuth.ts         # Authentication logic
├── useCrud.ts         # CRUD operations
├── useAppToast.ts     # Toast notifications
├── useAppConfirm.ts   # Confirmation dialogs
├── useFormat.ts       # Data formatting (currency, date)
├── useFileUpload.ts   # File upload handling
├── useExport.ts       # Data export (CSV, Excel)
├── useRtl.ts          # RTL detection
└── useColorMode.ts    # Theme management
```

#### 3.3 Middleware
```
app/middleware/
├── auth.ts            # Require authentication
├── guest.ts           # Redirect if authenticated
└── admin.ts           # Require admin role
```

---

### Phase 4: Authentication & Layouts
**Goal**: Implement authentication flow and page layouts

#### 4.1 Layouts
```
app/layouts/
├── default.vue        # Default (redirect)
├── auth.vue           # Auth pages (login)
└── dashboard.vue      # Main dashboard layout
```

#### 4.2 Auth Pages
```
app/pages/auth/
├── login.vue          # Login page
├── forgot-password.vue # Forgot password
└── reset-password.vue # Reset password
```

#### 4.3 Plugins
```
app/plugins/
├── init.client.ts     # Initialize stores
└── apexcharts.client.ts # Register ApexCharts
```

---

### Phase 5: Dashboard & Analytics
**Goal**: Build the main dashboard with stats and charts

#### 5.1 Dashboard Page
```
app/pages/dashboard/
└── index.vue          # Main dashboard
```

**Dashboard Features**:
- **Stat Cards**: Today's conversations, orders, revenue, new customers
- **AI Provider Status**: Real-time provider availability and usage
- **Charts**:
  - Conversations over time (Area chart)
  - Orders by status (Donut chart)
  - Revenue trend (Line chart)
  - Top products (Bar chart)
- **Recent Activity**:
  - Latest conversations requiring attention
  - Recent orders
  - Low stock alerts
- **Platform Distribution**: WhatsApp vs Messenger vs Instagram

#### 5.2 Dashboard Components
```
app/components/dashboard/
├── StatCard.vue       # KPI stat card
├── AIProviderCard.vue # AI provider status
├── RecentConversations.vue
├── RecentOrders.vue
├── LowStockAlert.vue
└── PlatformStats.vue
```

---

### Phase 6: Conversations Management
**Goal**: Complete conversation management with real-time messaging

#### 6.1 Pages
```
app/pages/conversations/
├── index.vue          # Conversation list
└── [id].vue           # Conversation detail/chat view
```

#### 6.2 Features
- **List View**:
  - Filter by platform (WhatsApp, Messenger, Instagram)
  - Filter by status (Active, Pending Handoff, Resolved)
  - Search by customer name/phone
  - Sort by date, unread count
  - Quick actions (mark resolved, assign)

- **Detail View**:
  - Full message history (chat-style UI)
  - Customer info sidebar
  - Intent detection display
  - Manual reply input
  - Mark as resolved
  - Transfer to human
  - View linked orders

#### 6.3 Conversation Components
```
app/components/conversations/
├── ConversationList.vue
├── ConversationItem.vue
├── ConversationChat.vue
├── MessageBubble.vue
├── CustomerSidebar.vue
├── ReplyInput.vue
└── IntentBadge.vue
```

---

### Phase 7: Orders Management
**Goal**: Complete order management system

#### 7.1 Pages
```
app/pages/orders/
├── index.vue          # Order list
├── [id].vue           # Order detail
└── create.vue         # Manual order creation
```

#### 7.2 Features
- **List View**:
  - Filter by status (Pending, Confirmed, Shipped, Delivered, Cancelled)
  - Filter by date range
  - Filter by payment method
  - Search by order number, customer
  - Bulk status update
  - Export to CSV/Excel

- **Detail View**:
  - Order items with images
  - Customer information
  - Shipping details
  - Status timeline
  - Status update actions
  - Print invoice
  - Link to conversation

- **Create View**:
  - Select customer or create new
  - Add products with quantities
  - Select shipping governorate
  - Apply coupon
  - Calculate totals

#### 7.3 Order Components
```
app/components/orders/
├── OrderList.vue
├── OrderItem.vue
├── OrderDetail.vue
├── OrderTimeline.vue
├── OrderItems.vue
├── OrderStatusBadge.vue
├── OrderActions.vue
└── OrderInvoice.vue
```

---

### Phase 8: Products & Categories
**Goal**: Product catalog management

#### 8.1 Pages
```
app/pages/products/
├── index.vue          # Product list
├── [id]/edit.vue      # Edit product
├── create.vue         # Create product
└── low-stock.vue      # Low stock report

app/pages/categories/
├── index.vue          # Category list
├── [id]/edit.vue      # Edit category
└── create.vue         # Create category
```

#### 8.2 Features
- **Product List**:
  - Grid/List view toggle
  - Filter by category, status, stock level
  - Search by name, code
  - Quick stock update
  - Bulk actions (activate, deactivate)

- **Product Form**:
  - Multi-language fields (Arabic/English)
  - Category selection
  - Price and old price (for discounts)
  - Stock management
  - Image upload (multiple)
  - Variants (size, color)
  - SEO fields

- **Category Management**:
  - Hierarchical categories (parent/child)
  - Drag-drop reordering
  - Image upload

#### 8.3 Product Components
```
app/components/products/
├── ProductList.vue
├── ProductCard.vue
├── ProductForm.vue
├── ProductImages.vue
├── ProductVariants.vue
├── StockBadge.vue
└── CategoryTree.vue
```

---

### Phase 9: Customers Management
**Goal**: Customer database and analytics

#### 9.1 Pages
```
app/pages/customers/
├── index.vue          # Customer list
└── [id].vue           # Customer profile
```

#### 9.2 Features
- **List View**:
  - Filter by platform
  - Filter by status (active, blocked)
  - Search by name, phone
  - Sort by orders, total spent
  - Export customer data

- **Profile View**:
  - Customer information
  - Order history
  - Conversation history
  - Total spent, order count
  - Block/unblock action
  - Notes

#### 9.3 Customer Components
```
app/components/customers/
├── CustomerList.vue
├── CustomerCard.vue
├── CustomerProfile.vue
├── CustomerOrders.vue
├── CustomerConversations.vue
└── CustomerStats.vue
```

---

### Phase 10: Settings & Configuration
**Goal**: System settings and configuration panels

#### 10.1 Pages
```
app/pages/settings/
├── index.vue          # General settings
├── shipping.vue       # Shipping/governorates
├── templates.vue      # Message templates
├── knowledge.vue      # Knowledge base
├── ai-providers.vue   # AI provider config
└── profile.vue        # Admin profile
```

#### 10.2 Features
- **General Settings**:
  - Store name (Arabic/English)
  - Contact info
  - Working hours
  - Currency settings
  - Low stock threshold

- **Shipping Settings**:
  - Governorate list with shipping costs
  - Delivery time settings
  - Free shipping threshold

- **Message Templates**:
  - Greeting messages
  - Order confirmation
  - Shipping notification
  - Custom responses
  - Variable placeholders

- **Knowledge Base**:
  - FAQ management
  - Category-based organization
  - Keywords for matching
  - Import/export

- **AI Providers**:
  - View all provider statuses
  - Usage statistics
  - Priority configuration
  - Test endpoints

#### 10.3 Settings Components
```
app/components/settings/
├── GeneralSettings.vue
├── ShippingSettings.vue
├── GovernorateList.vue
├── TemplateEditor.vue
├── KnowledgeList.vue
├── KnowledgeForm.vue
├── AIProviderList.vue
└── AIProviderCard.vue
```

---

### Phase 11: Testing & Developer Tools
**Goal**: Testing interface for development

#### 11.1 Pages
```
app/pages/dev/
├── index.vue          # Dev tools dashboard
├── chat-simulator.vue # Test conversations
├── intent-tester.vue  # Test intent detection
└── api-tester.vue     # API endpoint tester
```

#### 11.2 Features
- **Chat Simulator**:
  - Send test messages
  - View bot responses
  - See detected intents
  - Test different scenarios

- **Intent Tester**:
  - Input text
  - View detected intent
  - View extracted entities
  - Sample messages

- **API Tester**:
  - Test any endpoint
  - View request/response
  - Save test cases

---

### Phase 12: Localization & Polish
**Goal**: Complete Arabic/English translations and final polish

#### 12.1 Localization Files
```
locales/
├── ar.json            # Arabic translations
└── en.json            # English translations
```

#### 12.2 Translation Categories
- Navigation & menu items
- Page titles & headers
- Form labels & placeholders
- Button text
- Status labels
- Error messages
- Success messages
- Confirmation dialogs
- Empty states
- Tooltips

#### 12.3 Final Polish
- Responsive design testing
- Dark mode verification
- RTL layout fixes
- Loading states everywhere
- Error handling
- Empty states
- Keyboard navigation
- Accessibility (ARIA)

---

## File Count Summary

| Phase | Category | Files |
|-------|----------|-------|
| 1 | Setup & Config | 8 |
| 2 | UI Components | 35 |
| 3 | Stores & Composables | 16 |
| 4 | Auth & Layouts | 6 |
| 5 | Dashboard | 8 |
| 6 | Conversations | 10 |
| 7 | Orders | 12 |
| 8 | Products | 14 |
| 9 | Customers | 9 |
| 10 | Settings | 14 |
| 11 | Dev Tools | 4 |
| 12 | Localization | 2 |
| **Total** | | **~138 files** |

---

## API Response Types (TypeScript)

### Pagination Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
```

### Common Entities
```typescript
interface Conversation {
  id: string;
  platformId: string;
  platform: 'WhatsApp' | 'Messenger' | 'Instagram';
  customerName?: string;
  status: 'Active' | 'PendingHandoff' | 'Resolved';
  lastMessageAt: string;
  unreadCount: number;
  customerId?: string;
  customer?: Customer;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subTotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  shippingAddress: string;
  customerPhone: string;
  paymentMethod: 'CashOnDelivery' | 'Online';
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  nameArabic: string;
  description?: string;
  descriptionArabic?: string;
  price: number;
  oldPrice?: number;
  currency: string;
  categoryId?: string;
  category?: Category;
  status: 'Available' | 'OutOfStock' | 'Discontinued';
  stockQuantity: number;
  lowStockThreshold: number;
  soldCount: number;
  isActive: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

interface Customer {
  id: string;
  platformId: string;
  platform: 'WhatsApp' | 'Messenger' | 'Instagram';
  name?: string;
  phone?: string;
  address?: string;
  governorate?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt?: string;
  isBlocked: boolean;
  createdAt: string;
}

interface AIProviderStatus {
  provider: string;
  isAvailable: boolean;
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
  priority: number;
}
```

---

## Verification Checklist

### Per Phase
- [ ] All files created
- [ ] No TypeScript errors
- [ ] Components render correctly
- [ ] API integration works
- [ ] Dark mode works
- [ ] RTL layout correct
- [ ] Responsive design

### Final
- [ ] All CRUD operations work
- [ ] Authentication flow complete
- [ ] All charts display data
- [ ] Export functions work
- [ ] Error handling in place
- [ ] Loading states everywhere
- [ ] Arabic translations complete
- [ ] Mobile responsive
- [ ] Performance optimized

---

## Ready to Start?
Confirm to begin with **Phase 1: Project Setup & Core Infrastructure**
