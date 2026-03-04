 
const RefreshmentSale = require("../models/RefreshmentSale");
const Refreshment = require("../models/Refreshment");
const Theatre = require("../models/Theatre");

// Record a refreshment sale (theatre owner / staff)
const recordSale = async (req, res) => {
  try {
    const { theatreId, refreshmentId, quantity = 1, unitPrice } = req.body;
    if (!theatreId || !refreshmentId) return res.status(400).json({ msg: "Missing theatreId or refreshmentId" });

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

    const refreshment = await Refreshment.findById(refreshmentId);
    if (!refreshment) return res.status(404).json({ msg: "Refreshment not found" });

    const price = unitPrice != null ? Number(unitPrice) : (refreshment.price || 0);
    const qty = Number(quantity) || 1;
    const total = price * qty;

    const sale = await RefreshmentSale.create({
      theatre: theatreId,
      refreshment: refreshmentId,
      quantity: qty,
      unitPrice: price,
      totalPrice: total,
      soldBy: req.user ? req.user._id : undefined
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Owner: get refreshment sales for their theatre (optional date range)
const getOwnerSales = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const theatre = await Theatre.findOne({ owner: ownerId });
    if (!theatre) return res.status(404).json({ msg: "Theatre not found" });

    const { start, end } = req.query;
    const filter = { theatre: theatre._id };
    if (start || end) {
      filter.soldAt = {};
      if (start) filter.soldAt.$gte = new Date(start);
      if (end) filter.soldAt.$lte = new Date(end);
    }

    const sales = await RefreshmentSale.find(filter).populate("refreshment").sort({ soldAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: aggregated refreshment stats over date range
const getAdminRefreshmentStats = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.soldAt = {};
      if (start) filter.soldAt.$gte = new Date(start);
      if (end) filter.soldAt.$lte = new Date(end);
    }

    const sales = await RefreshmentSale.find(filter).populate("refreshment theatre");

    // aggregate totals and top items
    const totals = { totalRevenue: 0, totalItems: 0 };
    const itemMap = {};
    const theatreMap = {};

    sales.forEach(s => {
      totals.totalRevenue += s.totalPrice || 0;
      totals.totalItems += s.quantity || 0;

      const itemId = s.refreshment?._id?.toString() || 'unknown';
      const itemName = s.refreshment?.name || 'Unknown';
      itemMap[itemId] = itemMap[itemId] || { name: itemName, qty: 0, revenue: 0 };
      itemMap[itemId].qty += s.quantity || 0;
      itemMap[itemId].revenue += s.totalPrice || 0;

      const thId = s.theatre?._id?.toString() || 'unknown';
      const thName = s.theatre?.name || 'Unknown';
      theatreMap[thId] = theatreMap[thId] || { name: thName, revenue: 0 };
      theatreMap[thId].revenue += s.totalPrice || 0;
    });

    const topItems = Object.entries(itemMap).sort((a,b)=>b[1].revenue - a[1].revenue).slice(0,10).map(([id, v])=>({ id, name: v.name, qty: v.qty, revenue: v.revenue }));
    const theatreStats = Object.entries(theatreMap).map(([id,v])=>({ id, name: v.name, revenue: v.revenue }));

    res.json({ totals, topItems, theatreStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordSale, getOwnerSales, getAdminRefreshmentStats };
