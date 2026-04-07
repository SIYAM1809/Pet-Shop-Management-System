import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Get all products (public, with filters)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const { animalCategory, productType, status, featured, search, sort, limit = 20, page = 1 } = req.query;

    const query = {};

    if (animalCategory) query.animalCategory = animalCategory;
    if (productType) query.productType = productType;
    if (status) query.status = status;
    if (featured === 'true') query.featured = true;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
    }

    // Sort options
    let sortQuery = { createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    else if (sort === 'price_desc') sortQuery = { price: -1 };
    else if (sort === 'name') sortQuery = { name: 1 };
    else if (sort === 'newest') sortQuery = { createdAt: -1 };

    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;

    let productsQuery = Product.find(query).sort(sortQuery);

    if (limitNum > 0) {
        productsQuery = productsQuery.skip(skip).limit(limitNum);
    }

    const [products, total] = await Promise.all([
        productsQuery,
        Product.countDocuments(query)
    ]);

    res.json({
        success: true,
        count: products.length,
        total,
        totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
        currentPage: parseInt(page),
        data: products
    });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ featured: true, status: 'Active' })
        .sort({ createdAt: -1 })
        .limit(8);

    res.json({ success: true, count: products.length, data: products });
});

// @desc    Get product stats
// @route   GET /api/products/stats
// @access  Private
export const getProductStats = asyncHandler(async (req, res) => {
    const [total, active, outOfStock, discontinued, byCategory] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ status: 'Active' }),
        Product.countDocuments({ status: 'Out of Stock' }),
        Product.countDocuments({ status: 'Discontinued' }),
        Product.aggregate([
            { $group: { _id: '$animalCategory', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
    ]);

    res.json({
        success: true,
        data: { total, active, outOfStock, discontinued, byCategory }
    });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private (Admin/Staff)
export const createProduct = asyncHandler(async (req, res) => {
    // Sanitise tags: accept comma-string or array
    if (typeof req.body.tags === 'string') {
        req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Staff)
export const updateProduct = asyncHandler(async (req, res) => {
    if (typeof req.body.tags === 'string') {
        req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    req.body.updatedAt = Date.now();

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
});
