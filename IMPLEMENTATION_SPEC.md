# Implementation Specification - Shah Marketplace Update

> **Approved Mockups:** 2026-01-18
> **Status:** Ready for Implementation

---

## ✅ APPROVED DESIGN DECISIONS

1. **Homepage Sections Grid:** Card grid layout
2. **Filter Sidebar:** Left sidebar (desktop) / Drawer (mobile)
3. **Add Product Form:** Single scrollable form (not wizard)
4. **Bulk Pricing UI:** Dynamic row add/remove
5. **Edit Diff Viewer:** Inline highlighting (not side-by-side)

---

## PHASE 1: BACKEND IMPLEMENTATION

### 1.1 New Models

#### **Section Model**
**File:** `backend/models/Section.js`

```javascript
{
  sectionId: String (auto-generated, unique),
  name: String (required),
  slug: String (unique, auto-generated from name),
  icon: String (emoji/unicode, default: '📦'),
  description: String,
  order: Number (display order, default: 0),
  isActive: Boolean (default: true),
  attributeSchema: Object (defines available attributes for this section),
  createdAt: Date,
  updatedAt: Date
}
```

**Example attributeSchema for Email Accounts:**
```json
{
  "quality": {
    "type": "select",
    "options": ["new", "old", "fresh", "aged", "used"],
    "required": true
  },
  "twoFa": {
    "type": "boolean",
    "label": "2FA Enabled"
  },
  "emailAccess": {
    "type": "boolean",
    "label": "Email Access"
  },
  "recovery": {
    "type": "boolean",
    "label": "Recovery Added"
  },
  "verified": {
    "type": "boolean",
    "label": "Verified"
  },
  "country": {
    "type": "string",
    "required": true
  }
}
```

**Indexes:**
- sectionId (unique)
- slug (unique)
- order, isActive (compound)

---

#### **Update Category Model**
**File:** `backend/models/Category.js`

**ADD:**
```javascript
{
  sectionId: ObjectId (reference to Section, required),
  slug: String (unique, auto-generated from name),
  order: Number (display order within section, default: 0)
}
```

**Update Indexes:**
- Add compound index: (sectionId, order)
- Add unique index: slug

---

#### **ProductAttribute Model**
**File:** `backend/models/ProductAttribute.js`

```javascript
{
  productId: ObjectId (reference to Product, required, unique),
  attributes: Object (flexible schema based on section)
}
```

**Example attributes:**
```json
{
  "quality": "fresh",
  "twoFa": true,
  "emailAccess": true,
  "recovery": true,
  "verified": true,
  "country": "USA"
}
```

**Indexes:**
- productId (unique)
- attributes.quality, attributes.country, attributes.twoFa (for filtering)

---

#### **Update Product Model**
**File:** `backend/models/Product.js`

**ADD:**
```javascript
{
  sectionId: ObjectId (reference to Section, required),
  bulkPricing: [{
    minQty: Number (required),
    maxQty: Number (null for unlimited),
    price: Number (required)
  }],
  previousVersion: Object (stores old data when edited),
  isEdited: Boolean (default: false)
}
```

**Update Indexes:**
- Add: sectionId
- Add compound: (sectionId, categoryId, status, isActive)

---

### 1.2 API Endpoints

#### **Section Management (Admin Only)**

**Routes File:** `backend/routes/adminRoutes.js`
**Controller:** `backend/controllers/adminController.js`

```javascript
// Section CRUD
POST   /api/admin/sections
  - Body: { name, icon, description, order, attributeSchema }
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Create new section with auto-generated slug
  - Returns: Created section object

GET    /api/admin/sections
  - Query: ?status=active (optional)
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: List all sections with category counts
  - Returns: Array of sections

GET    /api/admin/sections/:id
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Get section details
  - Returns: Section object

PUT    /api/admin/sections/:id
  - Body: { name, icon, description, order, attributeSchema, isActive }
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Update section
  - Returns: Updated section object

DELETE /api/admin/sections/:id
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Delete section (only if no categories exist)
  - Returns: Success message

PATCH  /api/admin/sections/reorder
  - Body: [{ id, order }, { id, order }, ...]
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Bulk update display order
  - Returns: Success message
```

---

#### **Category Management (Admin Only)**

**Routes File:** `backend/routes/adminRoutes.js`
**Controller:** `backend/controllers/adminController.js`

```javascript
// Category CRUD
POST   /api/admin/categories
  - Body: { sectionId, name, icon, description, order }
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Create new category with auto-generated slug
  - Returns: Created category object

GET    /api/admin/categories
  - Query: ?sectionId=xxx&status=active (optional)
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: List all categories with product counts
  - Returns: Array of categories with section details

GET    /api/admin/categories/:id
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Get category details
  - Returns: Category object with section details

PUT    /api/admin/categories/:id
  - Body: { sectionId, name, icon, description, order, isActive }
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Update category
  - Returns: Updated category object

DELETE /api/admin/categories/:id
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Delete category (only if no products exist)
  - Returns: Success message

PATCH  /api/admin/categories/reorder
  - Body: [{ id, order }, { id, order }, ...]
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Bulk update display order within section
  - Returns: Success message
```

---

#### **Public Section/Category Endpoints**

**Routes File:** `backend/routes/productRoutes.js`
**Controller:** `backend/controllers/productController.js`

```javascript
GET    /api/sections
  - Query: none
  - Middleware: none (public)
  - Action: Get all active sections with category counts
  - Returns: Array of sections

GET    /api/sections/:id/categories
  - Middleware: none (public)
  - Action: Get all active categories in a section
  - Returns: Array of categories
```

---

#### **Update Product Endpoints**

**Routes File:** `backend/routes/productRoutes.js`
**Controller:** `backend/controllers/productController.js`

```javascript
// CREATE PRODUCT (Seller)
POST   /api/products
  - Body: {
      sectionId,
      categoryId,
      productName,
      description,
      price,
      bulkPricing: [{ minQty, maxQty, price }],
      inventoryType,
      quantity,
      deliveryType,
      replacementAvailable,
      replacementDuration,
      images,
      attributes: { quality, twoFa, emailAccess, ... }
    }
  - Middleware: authenticate, requireRole(['seller']), requireSellerApproved
  - Action: Create product + ProductAttribute record
  - Status: "pending"
  - Returns: Created product object

// UPDATE PRODUCT (Seller)
PUT    /api/products/:id
  - Body: Same as POST
  - Middleware: authenticate, requireRole(['seller']), requireSellerApproved
  - Action:
    - If product status was "approved":
      - Store current data in previousVersion field
      - Set status to "pending"
      - Set isEdited to true
    - Update product + ProductAttribute
  - Returns: Updated product object

// GET PRODUCTS (Public/Buyer) - Enhanced filtering
GET    /api/products
  - Query: ?sectionId=xxx&categoryId=xxx&quality=fresh&twoFa=true
           &country=USA&minPrice=10&maxPrice=100&page=1&limit=20
  - Middleware: none (public)
  - Action: Filter products with attributes
  - Returns: Array of products with attributes

// GET PRODUCT DETAILS (Public)
GET    /api/products/:id
  - Middleware: none (public)
  - Action: Get product with attributes, section, category details
  - Returns: Product object with attributes

// GET SELLER'S PRODUCTS (Seller)
GET    /api/products/seller
  - Query: ?status=approved|pending|rejected
  - Middleware: authenticate, requireRole(['seller'])
  - Action: Get seller's products filtered by status
  - Returns: Array of products with attributes
```

---

#### **Update Admin Product Approval**

**Routes File:** `backend/routes/adminRoutes.js`
**Controller:** `backend/controllers/adminController.js`

```javascript
// GET PENDING PRODUCTS (Admin)
GET    /api/admin/products/pending
  - Query: ?page=1&limit=20
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Get pending products with isEdited flag
  - Returns: Array of products (show new vs edited)

// GET PRODUCT CHANGES (Admin)
GET    /api/admin/products/:id/changes
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action: Compare current version with previousVersion
  - Returns: {
      current: { ... },
      previous: { ... },
      changes: [
        { field: "price", old: "15.99", new: "17.99" },
        { field: "stock", old: "30", new: "50" }
      ]
    }

// APPROVE PRODUCT (Admin)
POST   /api/admin/products/:id/approve
  - Body: { adminNotes: "..." } (optional)
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action:
    - Set status to "approved"
    - Clear isEdited flag
    - Clear previousVersion
    - Send notification to seller
    - Create AdminLog entry
  - Returns: Updated product object

// REJECT PRODUCT (Admin)
POST   /api/admin/products/:id/reject
  - Body: { rejectionReason: "..." } (required)
  - Middleware: authenticate, requireRole(['admin', 'super-admin'])
  - Action:
    - Set status to "rejected"
    - Set rejectionReason
    - Send notification to seller
    - Create AdminLog entry
  - Returns: Updated product object
```

---

### 1.3 Backend Validation

**Create:** `backend/middleware/sectionValidation.js`
```javascript
- Validate section name (required, 2-50 chars)
- Validate slug (unique, lowercase, hyphens only)
- Validate icon (required, max 10 chars)
- Validate order (number, min 0)
- Validate attributeSchema (valid JSON object)
```

**Create:** `backend/middleware/categoryValidation.js`
```javascript
- Validate sectionId (required, exists)
- Validate name (required, 2-50 chars)
- Validate slug (unique, lowercase, hyphens only)
- Validate icon (required, max 10 chars)
- Validate order (number, min 0)
```

**Update:** `backend/middleware/productValidation.js`
```javascript
- Add sectionId validation (required, exists)
- Add bulkPricing validation (array of valid price tiers)
- Add attributes validation (based on section's attributeSchema)
```

---

### 1.4 Backend Controllers

**Update:** `backend/controllers/adminController.js`
```javascript
// Add section management functions
- createSection
- getSections
- getSectionById
- updateSection
- deleteSection
- reorderSections

// Add category management functions
- createCategory
- getCategories
- getCategoryById
- updateCategory
- deleteCategory
- reorderCategories

// Update product approval functions
- getPendingProducts (include isEdited flag)
- getProductChanges (new function)
- approveProduct (clear isEdited, previousVersion)
- rejectProduct (existing)
```

**Update:** `backend/controllers/productController.js`
```javascript
// Add section/category functions
- getSections (public)
- getSectionCategories (public)

// Update product functions
- createProduct (add sectionId, attributes)
- updateProduct (handle edit → pending logic)
- getProducts (filter by section, category, attributes)
- getProductById (include attributes)
- getSellerProducts (filter by status)
```

---

## PHASE 2: FRONTEND CLEANUP

### 2.1 Remove Legacy JSX Files

**Files to DELETE:**
```
src/pages/public/Browse.jsx
src/pages/seller_/AddProduct.jsx
src/pages/seller_/SellerProducts.jsx
src/pages/seller_/MyProducts.jsx
src/pages/seller_/SellerOrders.jsx
src/pages/seller_/Dashboard.jsx
```

**Verify no imports remain:**
- Search for imports from deleted files
- Update any App.jsx routes pointing to old files
- Remove from navigation components

---

## PHASE 3: FRONTEND IMPLEMENTATION

### 3.1 New Pages

#### **Marketplace Homepage**
**File:** `src/pages/marketplace/Marketplace.tsx`

**Features:**
- Fetch sections from GET /api/sections
- Grid layout: 4 cols (desktop) → 2 cols (tablet) → 1 col (mobile)
- Each section card shows: icon, name, description, product count
- Click → Navigate to /marketplace/:sectionSlug
- Loading state and error handling
- Empty state if no sections

**Components used:**
- Card, CardContent, CardHeader, CardTitle (Shadcn)
- Grid layout with Tailwind classes

---

#### **Section View Page**
**File:** `src/pages/marketplace/SectionView.tsx`

**Route:** `/marketplace/:sectionSlug`

**Features:**
- Fetch section details and categories from GET /api/sections/:id/categories
- Display section header with icon, name, description
- Show categories as horizontal tabs (Shadcn Tabs)
- Tab shows: category name, product count
- Click category → Navigate to /marketplace/:sectionSlug/:categorySlug
- Responsive: Scrollable tabs on mobile

**Components used:**
- Tabs, TabsList, TabsTrigger (Shadcn)
- Breadcrumb navigation

---

#### **Product Listing Page**
**File:** `src/pages/marketplace/ProductListing.tsx`

**Route:** `/marketplace/:sectionSlug/:categorySlug`

**Layout:**
```
┌────────────┬───────────────────┐
│ FilterPanel│ Product Grid      │
│ (sidebar)  │                   │
│            │                   │
└────────────┴───────────────────┘
```

**Features:**
- Fetch products from GET /api/products with filters
- Left sidebar: FilterPanel component
- Main area: Product grid
- Sort dropdown (newest, price low-high, rating)
- Grid/List view toggle
- Pagination
- Mobile: FilterPanel opens as drawer

**Components used:**
- Sheet (Shadcn) for mobile drawer
- ProductCard component
- Pagination component

---

#### **FilterPanel Component**
**File:** `src/components/marketplace/FilterPanel.tsx`

**Props:**
```typescript
{
  sectionId: string,
  attributeSchema: object,
  onFilterChange: (filters) => void
}
```

**Features:**
- Dynamic filters based on attributeSchema
- Quality checkboxes (multi-select)
- Security checkboxes (2FA, Recovery, etc.)
- Access checkboxes
- Country dropdown with search
- Price range slider (min/max)
- Apply Filters button
- Reset All button
- Accordion-style collapsible sections
- Sticky position on desktop

**Components used:**
- Checkbox (Shadcn)
- Select, Slider (Shadcn)
- Accordion (Shadcn)
- Button (Shadcn)

---

### 3.2 Update Existing Pages

#### **Update ProductCard**
**File:** `src/components/cards/ProductCard.tsx`

**ADD:**
- Attribute badges (✔ Fresh, ✔ 2FA, 🌍 USA)
- Bulk pricing indicator ("Bulk: $9.99")
- Stock count display ("📦 45")
- Badge color coding:
  - Green: Security features (2FA, Recovery, Verified)
  - Blue: Quality (Fresh, New, Aged)
  - Gray: Country
- Max 3-4 badges visible, rest in tooltip
- Responsive: Stack badges on mobile

**Components used:**
- Badge (Shadcn)
- Tooltip (Shadcn)

---

#### **Update AddProduct Form**
**File:** `src/pages/seller/AddProduct.tsx`

**Layout:** Single scrollable form with sections

**Sections:**
1. **Basic Information**
   - Section dropdown (fetch from GET /api/sections)
   - Category dropdown (filtered by selected section)
   - Product name
   - Description

2. **Pricing & Inventory**
   - Single price input
   - Bulk Pricing section:
     - Dynamic rows: [Min Qty] [Max Qty] [Price] [Remove]
     - [+ Add Bulk Price Tier] button
   - Inventory type (Unlimited/Limited)
   - Stock quantity

3. **Product Attributes** (DYNAMIC)
   - Render fields based on section's attributeSchema
   - Quality (radio buttons)
   - Security features (checkboxes)
   - Access options (checkboxes)
   - Country (dropdown)

4. **Delivery & Warranty**
   - Delivery type
   - Replacement available
   - Replacement duration

5. **Media**
   - Image upload (existing)

**Edit Mode:**
- Show warning banner: "Editing will send to pending status"
- Checkbox: "I understand and want to proceed"
- Disable submit until checked

**Components used:**
- Form, FormField, FormItem, FormLabel, FormControl (Shadcn)
- Input, Textarea, Select, RadioGroup, Checkbox (Shadcn)
- Alert (Shadcn) for warning banner

---

#### **Update MyProducts Page**
**File:** `src/pages/seller/MyProducts.tsx`

**Layout:** Tabs for Approved, Pending, Rejected

**Features:**
- Fetch products from GET /api/products/seller?status=...
- Three tabs with counts: "Approved (12)", "Pending (3)", "Rejected (1)"
- Product list shows:
  - Product name, section/category breadcrumb
  - Price, stock, sales (approved only)
  - Status badge (✔ Approved, ⏳ Pending, ❌ Rejected, ⚠️ EDITED)
  - Submission/edit timestamp
  - Rejection reason (rejected tab)
- Actions:
  - Approved: [Edit] [Deactivate] [Analytics]
  - Pending: [View Details] (edit disabled)
  - Rejected: [View Details] [Edit & Resubmit] [Delete]
- Show warning icon for edited products awaiting re-approval

**Components used:**
- Tabs, TabsList, TabsTrigger, TabsContent (Shadcn)
- Badge (Shadcn)
- Alert (Shadcn) for rejection reasons

---

#### **Admin Sections Management**
**File:** `src/pages/admin/Sections.tsx`

**Features:**
- Fetch sections from GET /api/admin/sections
- Table showing: #, Icon, Name, Category count, Status
- Actions menu (⋮): Edit, Manage Categories, Configure Attributes, Reorder, Deactivate, Delete
- [+ Create New Section] button
- Create/Edit modal with form:
  - Name, Icon, Description, Order, Status
  - Attribute Schema (JSON editor or form builder)
- Delete confirmation (only if no categories)
- Drag-and-drop reordering

**Components used:**
- Table (Shadcn)
- Dialog (Shadcn) for create/edit modal
- DropdownMenu (Shadcn) for actions
- Textarea (for JSON schema) or custom form builder
- AlertDialog (Shadcn) for delete confirmation

---

#### **Admin Categories Management**
**File:** `src/pages/admin/Categories.tsx`

**Features:**
- Fetch categories from GET /api/admin/categories
- Filter dropdown: "All Sections" or select specific section
- Table showing: Section, Name, Icon, Product count, Status
- Actions menu (⋮): Edit, View Products, Reorder, Deactivate, Delete
- [+ Create New Category] button
- Create/Edit modal with form:
  - Section dropdown
  - Name, Icon, Description, Order, Status
- Delete confirmation (only if no products)
- Drag-and-drop reordering within section

**Components used:**
- Table (Shadcn)
- Dialog (Shadcn) for create/edit modal
- Select (Shadcn) for section filter
- DropdownMenu (Shadcn) for actions
- AlertDialog (Shadcn) for delete confirmation

---

#### **Update Admin Products Page**
**File:** `src/pages/admin/AdminProducts.jsx`

**Features:**
- Tabs: Pending (15), Approved (234), Rejected (12)
- Pending tab shows:
  - Badge: "⏳ New Submission" or "⚠️ EDITED - Re-approval"
  - For edited products: Show inline changes
    - "Price: $15.99 → $17.99" (yellow highlight)
    - "Stock: 30 → 50" (yellow highlight)
  - [View Details] [View Changes] [Approve] [Reject] buttons
- "View Changes" opens modal:
  - Inline diff with highlighted changes
  - Changed fields in yellow
  - Unchanged fields in gray
  - Admin notes textarea
  - [Approve Changes] [Reject] buttons
- Reject modal:
  - Rejection reason textarea
  - Quick reason templates (buttons)
  - [Send notification to seller] checkbox

**Components used:**
- Tabs (Shadcn)
- Badge (Shadcn)
- Dialog (Shadcn) for view changes modal
- Alert (Shadcn) for inline change highlights
- Textarea (Shadcn)

---

### 3.3 Update API Services

**File:** `src/api/services.js`

**ADD:**
```javascript
// Section services
sectionService: {
  getAll: () => axios.get('/sections'),
  getCategories: (id) => axios.get(`/sections/${id}/categories`),
}

// Admin section services
adminSectionService: {
  getAll: () => axios.get('/admin/sections'),
  getById: (id) => axios.get(`/admin/sections/${id}`),
  create: (data) => axios.post('/admin/sections', data),
  update: (id, data) => axios.put(`/admin/sections/${id}`, data),
  delete: (id) => axios.delete(`/admin/sections/${id}`),
  reorder: (data) => axios.patch('/admin/sections/reorder', data),
}

// Admin category services
adminCategoryService: {
  getAll: (sectionId) => axios.get('/admin/categories', { params: { sectionId } }),
  getById: (id) => axios.get(`/admin/categories/${id}`),
  create: (data) => axios.post('/admin/categories', data),
  update: (id, data) => axios.put(`/admin/categories/${id}`, data),
  delete: (id) => axios.delete(`/admin/categories/${id}`),
  reorder: (data) => axios.patch('/admin/categories/reorder', data),
}

// Update product services
productService: {
  getAll: (filters) => axios.get('/products', { params: filters }), // Add filters
  // ... existing methods ...
}

// Admin product services
adminProductService: {
  getChanges: (id) => axios.get(`/admin/products/${id}/changes`), // NEW
  // ... existing methods ...
}
```

---

### 3.4 Update Routing

**File:** `src/App.jsx`

**ADD Routes:**
```javascript
// Public marketplace routes
<Route path="/marketplace" element={<Marketplace />} />
<Route path="/marketplace/:sectionSlug" element={<SectionView />} />
<Route path="/marketplace/:sectionSlug/:categorySlug" element={<ProductListing />} />

// Admin routes
<Route path="/admin/sections" element={<AdminSections />} />
<Route path="/admin/categories" element={<AdminCategories />} />

// REMOVE old routes
// <Route path="/browse" element={<Browse />} /> (old JSX version)
// <Route path="/seller_/*" ... /> (all old seller_ routes)
```

**Update Navigation:**
- Update header navigation to point to /marketplace
- Update admin sidebar to include Sections and Categories links

---

## PHASE 4: TESTING & INTEGRATION

### 4.1 Backend Testing Checklist

- [ ] Section CRUD operations work
- [ ] Category CRUD operations work
- [ ] Section-Category relationship correct
- [ ] Product creation with sectionId and attributes
- [ ] Product edit → pending workflow
- [ ] Product filtering by section, category, attributes
- [ ] Admin approval workflow for edited products
- [ ] Product changes diff endpoint returns correct data
- [ ] Bulk pricing validation works
- [ ] AttributeSchema validation works

### 4.2 Frontend Testing Checklist

- [ ] Marketplace homepage displays sections
- [ ] Section view shows categories
- [ ] Product listing filters work
- [ ] FilterPanel updates query params
- [ ] ProductCard displays attributes correctly
- [ ] AddProduct form validates section/attributes
- [ ] Bulk pricing UI add/remove rows work
- [ ] Edit product shows warning
- [ ] MyProducts tabs show correct products
- [ ] Admin sections CRUD works
- [ ] Admin categories CRUD works
- [ ] Admin product approval shows diff correctly
- [ ] Mobile responsive (all pages)
- [ ] Navigation and routing work

### 4.3 Integration Testing

- [ ] Complete workflow: Create section → Create category → Add product → Approve
- [ ] Edit approved product → Goes to pending → Admin sees diff → Approve
- [ ] Filter products by multiple attributes
- [ ] Bulk pricing calculates correctly
- [ ] Stock management on purchase
- [ ] Mobile drawer filter panel works

---

## ESTIMATED WORK BREAKDOWN

| Phase | Tasks | Estimated Complexity |
|-------|-------|---------------------|
| Phase 1: Backend | 9 tasks | High (new models, complex logic) |
| Phase 2: Cleanup | 1 task | Low |
| Phase 3: Frontend | 13 tasks | Very High (many components) |
| Phase 4: Testing | 3 checklists | Medium |

**Total:** 26 tasks

---

## IMPLEMENTATION ORDER

1. ✅ Backend models (Section, update Category, ProductAttribute, update Product)
2. ✅ Backend API endpoints (Section, Category, Product updates)
3. ✅ Backend validation and controllers
4. ✅ Frontend cleanup (remove legacy files)
5. ✅ Frontend API services update
6. ✅ Frontend new components (FilterPanel, etc.)
7. ✅ Frontend new pages (Marketplace, SectionView, ProductListing)
8. ✅ Frontend update existing pages (ProductCard, AddProduct, MyProducts)
9. ✅ Frontend admin pages (Sections, Categories, update Products)
10. ✅ Frontend routing and navigation
11. ✅ Testing and bug fixes
12. ✅ Documentation and deployment

---

**Ready to begin implementation!** 🚀
