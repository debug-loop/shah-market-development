# Fix Backend Route Error

## Current Error
```
Error: Route.get() requires a callback function but got a [object Undefined]
    at Route.<computed> [as get] (...\routes\adminRoutes.js:44:8)
```

**Cause:** The `adminRoutes.js` file is trying to use controller functions (like `sectionController.create`, `categoryController.create`) that don't exist yet.

---

## Quick Fix Instructions

### Step 1: Navigate to Your Backend Repository

```bash
cd C:\Users\WWW\Documents\shah-dev\shaf-market-development-backend
```

### Step 2: Create Section Controller

**File:** `backend/controllers/sectionController.js`

Copy the entire contents from `/tmp/create-section-controller.js` (the file I created for you) to this location.

The controller includes these exports:
- `create` - Create new section (Admin)
- `getAll` - Get all sections (Admin)
- `getAllPublic` - Get all active sections (Public)
- `getById` - Get section by ID (Admin)
- `update` - Update section (Admin)
- `delete` - Delete section (Admin)
- `reorder` - Reorder sections (Admin)
- `getCategories` - Get categories in a section (Public)

### Step 3: Create Category Controller

**File:** `backend/controllers/categoryController.js`

Copy the entire contents from `/tmp/create-category-controller.js` (the file I created for you) to this location.

The controller includes these exports:
- `create` - Create new category (Admin)
- `getAll` - Get all categories (Admin)
- `getById` - Get category by ID (Admin)
- `update` - Update category (Admin)
- `delete` - Delete category (Admin)
- `reorder` - Reorder categories (Admin)

### Step 4: Verify AdminRoutes Imports

**File:** `backend/routes/adminRoutes.js`

Make sure the file has these imports at the top:

```javascript
const sectionController = require('../controllers/sectionController');
const categoryController = require('../controllers/categoryController');
```

And the routes should be defined like this (around line 44):

```javascript
// Section Management Routes
router.post('/sections', authenticate, requireRole(['admin', 'super-admin']), sectionController.create);
router.get('/sections', authenticate, requireRole(['admin', 'super-admin']), sectionController.getAll);
router.get('/sections/:id', authenticate, requireRole(['admin', 'super-admin']), sectionController.getById);
router.put('/sections/:id', authenticate, requireRole(['admin', 'super-admin']), sectionController.update);
router.delete('/sections/:id', authenticate, requireRole(['admin', 'super-admin']), sectionController.delete);
router.patch('/sections/reorder', authenticate, requireRole(['admin', 'super-admin']), sectionController.reorder);

// Category Management Routes
router.post('/categories', authenticate, requireRole(['admin', 'super-admin']), categoryController.create);
router.get('/categories', authenticate, requireRole(['admin', 'super-admin']), categoryController.getAll);
router.get('/categories/:id', authenticate, requireRole(['admin', 'super-admin']), categoryController.getById);
router.put('/categories/:id', authenticate, requireRole(['admin', 'super-admin']), categoryController.update);
router.delete('/categories/:id', authenticate, requireRole(['admin', 'super-admin']), categoryController.delete);
router.patch('/categories/reorder', authenticate, requireRole(['admin', 'super-admin']), categoryController.reorder);
```

### Step 5: Restart Backend Server

```bash
npm start
# or
node server.js
# or whatever your start command is
```

---

## If You Still Get Errors

1. **Check model files exist:**
   - `backend/models/Section.js`
   - `backend/models/Category.js` (updated)
   - `backend/models/ProductAttribute.js`

2. **Check AdminLog model exists:**
   - `backend/models/AdminLog.js`

   If it doesn't exist, create it or remove AdminLog references from the controllers temporarily.

3. **Verify path structure:**
   - Controllers should be in `backend/controllers/`
   - Routes should be in `backend/routes/`
   - Models should be in `backend/models/`

---

## Files to Copy from Frontend to Backend

From the `backend-changes/` directory in the frontend repo, copy to backend repo:

1. **Models:**
   - `backend-changes/models/Section.js` → `backend/models/Section.js`
   - `backend-changes/models/Category.js` → `backend/models/Category.js`
   - `backend-changes/models/ProductAttribute.js` → `backend/models/ProductAttribute.js`

2. **Controllers:**
   - `/tmp/create-section-controller.js` → `backend/controllers/sectionController.js`
   - `/tmp/create-category-controller.js` → `backend/controllers/categoryController.js`

3. **Update Product Model:**
   - Add fields from `backend-changes/models/Product-UPDATED.js` to your existing `backend/models/Product.js`
   - OR replace the entire file

---

## Testing After Fix

Once the server starts without errors:

```bash
# Test public sections endpoint
GET http://localhost:5000/api/sections

# Test admin sections endpoint (needs auth token)
GET http://localhost:5000/api/admin/sections
Authorization: Bearer <your-admin-token>
```

---

## Next Steps After Backend Works

1. Create seed data for 10 marketplace sections
2. Create categories for each section
3. Test complete workflow from frontend
4. Deploy to production

---

**Current Status:**
- ✅ Frontend marketplace pages complete
- ✅ Backend models created (in backend-changes/)
- ✅ Backend controllers created (in /tmp/)
- ⚠️ **Need to copy controllers to backend repo** ← YOU ARE HERE
- ⏳ Need to create seed data
- ⏳ Need to test integration
