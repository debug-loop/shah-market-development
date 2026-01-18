# Backend Integration Guide

> **How to apply these changes to your backend repository**
> Repository: https://github.com/debug-loop/shaf-market-development-backend

---

## 📦 FILES PROVIDED

In the `backend-changes` directory, you'll find:

```
backend-changes/
├── models/
│   ├── Section.js                    (NEW)
│   ├── Category.js                   (UPDATED)
│   ├── ProductAttribute.js           (NEW)
│   └── Product-UPDATED.js            (UPDATED)
└── BACKEND_INTEGRATION_GUIDE.md     (this file)
```

---

## 🔧 STEP 1: UPDATE MODELS

### 1.1 Add New Section Model

**File:** `backend/models/Section.js`

**Action:** Copy the entire file from `backend-changes/models/Section.js`

**What it does:**
- Creates Section model with attributeSchema for dynamic product attributes
- Auto-generates sectionId and slug
- Includes validation and indexes
- Method to get category count

---

### 1.2 Update Category Model

**File:** `backend/models/Category.js`

**Action:** Replace the existing file with `backend-changes/models/Category.js`

**Changes:**
- ✅ Added `sectionId` field (reference to Section)
- ✅ Added `slug` field (auto-generated from name)
- ✅ Added `order` field for display ordering
- ✅ Added compound indexes for better performance
- ✅ Added pre-save hook to auto-generate slug
- ✅ Added method to get product count

---

### 1.3 Add New ProductAttribute Model

**File:** `backend/models/ProductAttribute.js`

**Action:** Copy the entire file from `backend-changes/models/ProductAttribute.js`

**What it does:**
- Stores dynamic attributes for each product
- Flexible schema based on section's attributeSchema
- Validation method to check attributes against section schema
- Indexes for filtering (quality, country, twoFa, verified)

---

### 1.4 Update Product Model

**File:** `backend/models/Product.js`

**Action:** Update the existing Product model with these additions:

**ADD these fields:**
```javascript
sectionId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Section',
  required: [true, 'Section is required'],
  index: true,
},
bulkPricing: [
  {
    minQty: {
      type: Number,
      required: true,
      min: [1, 'Minimum quantity must be at least 1'],
    },
    maxQty: {
      type: Number,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, 'Price must be greater than 0'],
    },
  },
],
isEdited: {
  type: Boolean,
  default: false,
  index: true,
},
previousVersion: {
  type: mongoose.Schema.Types.Mixed,
  default: null,
},
```

**ADD these indexes:**
```javascript
productSchema.index({ sectionId: 1, categoryId: 1, status: 1, isActive: 1 });
productSchema.index({ status: 1, isEdited: 1 });
```

**ADD these methods:**
```javascript
// Method to get bulk price for quantity
productSchema.methods.getBulkPrice = function (quantity) {
  if (!this.bulkPricing || this.bulkPricing.length === 0) {
    return this.price;
  }

  for (const tier of this.bulkPricing) {
    if (quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)) {
      return tier.price;
    }
  }

  return this.price;
};
```

**Or:** Simply replace the entire file with `backend-changes/models/Product-UPDATED.js`

---

## 🛣️ STEP 2: ADD NEW ROUTES

### 2.1 Update Admin Routes

**File:** `backend/routes/adminRoutes.js`

**ADD these routes:**

```javascript
const sectionController = require('../controllers/sectionController');
const categoryController = require('../controllers/categoryController');

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

// Update existing product approval route
router.get('/products/:id/changes', authenticate, requireRole(['admin', 'super-admin']), adminController.getProductChanges);
```

---

### 2.2 Update Product Routes

**File:** `backend/routes/productRoutes.js`

**ADD these routes at the top (public):**

```javascript
const sectionController = require('../controllers/sectionController');

// Public section/category routes
router.get('/sections', sectionController.getAllPublic);
router.get('/sections/:id/categories', sectionController.getCategories);
```

---

## 🎮 STEP 3: CREATE CONTROLLERS

### 3.1 Create Section Controller

**File:** `backend/controllers/sectionController.js`

```javascript
const Section = require('../models/Section');
const Category = require('../models/Category');
const AdminLog = require('../models/AdminLog');

// Create new section (Admin)
exports.create = async (req, res) => {
  try {
    const { name, icon, description, order, attributeSchema } = req.body;

    const section = await Section.create({
      name,
      icon,
      description,
      order,
      attributeSchema,
    });

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'create_section',
      target: 'section',
      targetId: section._id,
      details: `Created section: ${section.name}`,
    });

    res.status(201).json({
      success: true,
      data: section,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all sections (Admin)
exports.getAll = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status === 'active') {
      filter.isActive = true;
    }

    const sections = await Section.find(filter).sort({ order: 1 });

    // Get category count for each section
    const sectionsWithCounts = await Promise.all(
      sections.map(async (section) => {
        const categoryCount = await Category.countDocuments({
          sectionId: section._id,
          isActive: true,
        });
        return {
          ...section.toObject(),
          categoryCount,
        };
      })
    );

    res.json({
      success: true,
      data: sectionsWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all active sections (Public)
exports.getAllPublic = async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true }).sort({ order: 1 });

    const sectionsWithCounts = await Promise.all(
      sections.map(async (section) => {
        const categoryCount = await Category.countDocuments({
          sectionId: section._id,
          isActive: true,
        });
        return {
          ...section.toObject(),
          categoryCount,
        };
      })
    );

    res.json({
      success: true,
      data: sectionsWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get section by ID (Admin)
exports.getById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update section (Admin)
exports.update = async (req, res) => {
  try {
    const { name, icon, description, order, attributeSchema, isActive } = req.body;

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { name, icon, description, order, attributeSchema, isActive },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'update_section',
      target: 'section',
      targetId: section._id,
      details: `Updated section: ${section.name}`,
    });

    res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete section (Admin)
exports.delete = async (req, res) => {
  try {
    // Check if section has categories
    const categoryCount = await Category.countDocuments({ sectionId: req.params.id });

    if (categoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete section with existing categories',
      });
    }

    const section = await Section.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'delete_section',
      target: 'section',
      targetId: section._id,
      details: `Deleted section: ${section.name}`,
    });

    res.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reorder sections (Admin)
exports.reorder = async (req, res) => {
  try {
    const { sections } = req.body; // Array of { id, order }

    await Promise.all(
      sections.map(async (item) => {
        await Section.findByIdAndUpdate(item.id, { order: item.order });
      })
    );

    res.json({
      success: true,
      message: 'Sections reordered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get categories in a section (Public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      sectionId: req.params.id,
      isActive: true,
    })
      .sort({ order: 1 })
      .populate('sectionId', 'name slug icon');

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

### 3.2 Create Category Controller

**File:** `backend/controllers/categoryController.js`

```javascript
const Category = require('../models/Category');
const Product = require('../models/Product');
const Section = require('../models/Section');
const AdminLog = require('../models/AdminLog');

// Create new category (Admin)
exports.create = async (req, res) => {
  try {
    const { sectionId, name, icon, description, order } = req.body;

    // Verify section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    const category = await Category.create({
      sectionId,
      name,
      icon,
      description,
      order,
    });

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'create_category',
      target: 'category',
      targetId: category._id,
      details: `Created category: ${category.name} in section: ${section.name}`,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all categories (Admin)
exports.getAll = async (req, res) => {
  try {
    const { sectionId, status } = req.query;
    const filter = {};

    if (sectionId) {
      filter.sectionId = sectionId;
    }

    if (status === 'active') {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .populate('sectionId', 'name slug icon')
      .sort({ sectionId: 1, order: 1 });

    // Get product count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          categoryId: category._id,
          status: 'approved',
          isActive: true,
        });
        return {
          ...category.toObject(),
          productCount,
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get category by ID (Admin)
exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('sectionId', 'name slug icon');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update category (Admin)
exports.update = async (req, res) => {
  try {
    const { sectionId, name, icon, description, order, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { sectionId, name, icon, description, order, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'update_category',
      target: 'category',
      targetId: category._id,
      details: `Updated category: ${category.name}`,
    });

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete category (Admin)
exports.delete = async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({ categoryId: req.params.id });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products',
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'delete_category',
      target: 'category',
      targetId: category._id,
      details: `Deleted category: ${category.name}`,
    });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reorder categories (Admin)
exports.reorder = async (req, res) => {
  try {
    const { categories } = req.body; // Array of { id, order }

    await Promise.all(
      categories.map(async (item) => {
        await Category.findByIdAndUpdate(item.id, { order: item.order });
      })
    );

    res.json({
      success: true,
      message: 'Categories reordered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

### 3.3 Update Admin Controller

**File:** `backend/controllers/adminController.js`

**ADD this method:**

```javascript
// Get product changes for edited products
exports.getProductChanges = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sectionId', 'name slug')
      .populate('categoryId', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (!product.isEdited || !product.previousVersion) {
      return res.status(400).json({
        success: false,
        message: 'Product has no changes to review',
      });
    }

    // Get product attributes
    const currentAttributes = await ProductAttribute.findOne({ productId: product._id });
    const previousAttributes = product.previousVersion.attributes || {};

    // Compare and find changes
    const changes = [];
    const currentData = {
      ...product.toObject(),
      attributes: currentAttributes?.attributes || {},
    };
    const previousData = product.previousVersion;

    // Fields to compare
    const fieldsToCompare = [
      'productName',
      'description',
      'price',
      'quantity',
      'deliveryType',
      'replacementAvailable',
      'replacementDuration',
      'bulkPricing',
    ];

    fieldsToCompare.forEach((field) => {
      const current = currentData[field];
      const previous = previousData[field];

      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        changes.push({
          field,
          old: previous,
          new: current,
        });
      }
    });

    // Compare attributes
    const attributeKeys = new Set([
      ...Object.keys(currentData.attributes || {}),
      ...Object.keys(previousAttributes || {}),
    ]);

    attributeKeys.forEach((key) => {
      const current = currentData.attributes[key];
      const previous = previousAttributes[key];

      if (current !== previous) {
        changes.push({
          field: `attributes.${key}`,
          old: previous,
          new: current,
        });
      }
    });

    res.json({
      success: true,
      data: {
        product: currentData,
        previousVersion: previousData,
        changes,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

**UPDATE the approveProduct method:**

```javascript
// Approve product
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.status = 'approved';
    product.isEdited = false;
    product.previousVersion = null;
    await product.save();

    // Send notification to seller
    await Notification.create({
      userId: product.sellerId,
      type: 'product_approval',
      title: 'Product Approved',
      message: `Your product "${product.productName}" has been approved and is now live.`,
    });

    // Log admin action
    await AdminLog.create({
      adminId: req.user._id,
      action: 'approve_product',
      target: 'product',
      targetId: product._id,
      details: req.body.adminNotes || `Approved product: ${product.productName}`,
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

### 3.4 Update Product Controller

**File:** `backend/controllers/productController.js`

**UPDATE the createProduct method to include sectionId and attributes:**

```javascript
// Create product (Seller)
exports.createProduct = async (req, res) => {
  try {
    const {
      sectionId,
      categoryId,
      productName,
      description,
      price,
      bulkPricing,
      inventoryType,
      quantity,
      deliveryType,
      customDeliveryTime,
      replacementAvailable,
      replacementDuration,
      images,
      attributes,
    } = req.body;

    // Verify section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Verify category exists and belongs to section
    const category = await Category.findById(categoryId);
    if (!category || category.sectionId.toString() !== sectionId) {
      return res.status(404).json({
        success: false,
        message: 'Invalid category for the selected section',
      });
    }

    // Create product
    const product = await Product.create({
      sellerId: req.user._id,
      sectionId,
      categoryId,
      productName,
      description,
      price,
      bulkPricing,
      inventoryType,
      quantity,
      deliveryType,
      customDeliveryTime,
      replacementAvailable,
      replacementDuration,
      images,
      status: 'pending',
    });

    // Create product attributes
    if (attributes) {
      const productAttribute = new ProductAttribute({
        productId: product._id,
        attributes,
      });

      // Validate attributes against section schema
      const validation = await productAttribute.validateAgainstSchema(sectionId);
      if (!validation.valid) {
        // Delete product if attributes are invalid
        await Product.findByIdAndDelete(product._id);
        return res.status(400).json({
          success: false,
          message: 'Invalid attributes',
          errors: validation.errors,
        });
      }

      await productAttribute.save();
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

**UPDATE the updateProduct method to handle edit → pending:**

```javascript
// Update product (Seller)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Verify ownership
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // If product was approved, store previous version and set to pending
    if (product.status === 'approved') {
      const productAttributes = await ProductAttribute.findOne({ productId: product._id });

      product.previousVersion = {
        ...product.toObject(),
        attributes: productAttributes?.attributes || {},
      };
      product.status = 'pending';
      product.isEdited = true;
    }

    // Update product fields
    const {
      sectionId,
      categoryId,
      productName,
      description,
      price,
      bulkPricing,
      inventoryType,
      quantity,
      deliveryType,
      customDeliveryTime,
      replacementAvailable,
      replacementDuration,
      images,
      attributes,
    } = req.body;

    if (sectionId) product.sectionId = sectionId;
    if (categoryId) product.categoryId = categoryId;
    if (productName) product.productName = productName;
    if (description) product.description = description;
    if (price) product.price = price;
    if (bulkPricing) product.bulkPricing = bulkPricing;
    if (inventoryType) product.inventoryType = inventoryType;
    if (quantity !== undefined) product.quantity = quantity;
    if (deliveryType) product.deliveryType = deliveryType;
    if (customDeliveryTime) product.customDeliveryTime = customDeliveryTime;
    if (replacementAvailable !== undefined) product.replacementAvailable = replacementAvailable;
    if (replacementDuration) product.replacementDuration = replacementDuration;
    if (images) product.images = images;

    await product.save();

    // Update attributes
    if (attributes) {
      await ProductAttribute.findOneAndUpdate(
        { productId: product._id },
        { attributes },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

**UPDATE the getProducts method to support filtering by attributes:**

```javascript
// Get all products (Public)
exports.getProducts = async (req, res) => {
  try {
    const {
      sectionId,
      categoryId,
      quality,
      twoFa,
      emailAccess,
      recovery,
      verified,
      country,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter
    const filter = {
      status: 'approved',
      isActive: true,
    };

    if (sectionId) filter.sectionId = sectionId;
    if (categoryId) filter.categoryId = categoryId;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Get products
    let products = await Product.find(filter)
      .populate('sellerId', 'businessName rating')
      .populate('sectionId', 'name slug icon')
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Filter by attributes
    if (quality || twoFa || emailAccess || recovery || verified || country) {
      const productIds = products.map((p) => p._id);
      const attributeFilter = { productId: { $in: productIds } };

      if (quality) attributeFilter['attributes.quality'] = quality;
      if (twoFa !== undefined) attributeFilter['attributes.twoFa'] = twoFa === 'true';
      if (emailAccess !== undefined) attributeFilter['attributes.emailAccess'] = emailAccess === 'true';
      if (recovery !== undefined) attributeFilter['attributes.recovery'] = recovery === 'true';
      if (verified !== undefined) attributeFilter['attributes.verified'] = verified === 'true';
      if (country) attributeFilter['attributes.country'] = country;

      const matchingAttributes = await ProductAttribute.find(attributeFilter);
      const matchingProductIds = matchingAttributes.map((attr) => attr.productId.toString());

      products = products.filter((p) => matchingProductIds.includes(p._id.toString()));
    }

    // Attach attributes to products
    const productAttributes = await ProductAttribute.find({
      productId: { $in: products.map((p) => p._id) },
    });

    const productsWithAttributes = products.map((product) => {
      const attributes = productAttributes.find(
        (attr) => attr.productId.toString() === product._id.toString()
      );
      return {
        ...product.toObject(),
        attributes: attributes?.attributes || {},
      };
    });

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: productsWithAttributes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

## 📝 STEP 4: TESTING

### Test Backend Changes:

1. **Install dependencies** (if uuid is new):
```bash
npm install uuid
```

2. **Test Section CRUD**:
```bash
# Create section
POST /api/admin/sections
{
  "name": "Email Accounts",
  "icon": "📧",
  "description": "Email account marketplace",
  "order": 1,
  "attributeSchema": {
    "quality": { "type": "select", "options": ["new", "old", "fresh", "aged"], "required": true },
    "twoFa": { "type": "boolean", "label": "2FA Enabled" },
    "emailAccess": { "type": "boolean", "label": "Email Access" },
    "country": { "type": "string", "required": true }
  }
}
```

3. **Test Category CRUD**:
```bash
# Create category
POST /api/admin/categories
{
  "sectionId": "<section-id>",
  "name": "Gmail",
  "icon": "📧",
  "description": "Gmail accounts",
  "order": 1
}
```

4. **Test Product with Attributes**:
```bash
# Create product
POST /api/products
{
  "sectionId": "<section-id>",
  "categoryId": "<category-id>",
  "productName": "Gmail Fresh Account",
  "description": "Fresh Gmail account with 2FA",
  "price": 12.99,
  "bulkPricing": [
    { "minQty": 10, "maxQty": 50, "price": 9.99 },
    { "minQty": 51, "maxQty": null, "price": 7.99 }
  ],
  "inventoryType": "limited",
  "quantity": 100,
  "attributes": {
    "quality": "fresh",
    "twoFa": true,
    "emailAccess": true,
    "country": "USA"
  }
}
```

5. **Test Product Edit Workflow**:
```bash
# Update approved product (should go to pending)
PUT /api/products/:id
{
  "price": 15.99
}

# Check product status (should be "pending" with isEdited: true)
GET /api/products/:id

# Admin view changes
GET /api/admin/products/:id/changes
```

---

## ✅ CHECKLIST

- [ ] Section model added
- [ ] Category model updated
- [ ] ProductAttribute model added
- [ ] Product model updated
- [ ] Section controller created
- [ ] Category controller created
- [ ] Admin controller updated (getProductChanges, approveProduct)
- [ ] Product controller updated (create, update, getProducts)
- [ ] Admin routes updated (sections, categories, products/changes)
- [ ] Product routes updated (public sections, categories)
- [ ] Tested section CRUD
- [ ] Tested category CRUD
- [ ] Tested product creation with attributes
- [ ] Tested product edit → pending workflow
- [ ] Tested product filtering by attributes
- [ ] Tested admin product approval with diff

---

## 🚀 DEPLOYMENT

Once all backend changes are applied and tested:

1. **Commit changes** to backend repository
2. **Push to remote** repository
3. **Deploy backend** to your hosting (Vercel, etc.)
4. **Update frontend** `.env` with new backend URL
5. **Test integration** between frontend and backend

---

**Backend integration complete!** The backend now supports:
- ✅ Section-based marketplace structure
- ✅ Dynamic product attributes
- ✅ Bulk pricing
- ✅ Product edit tracking
- ✅ Admin approval workflow with diff viewer
- ✅ Advanced product filtering

Next: Implement frontend changes! 🎨
