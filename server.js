const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ─── MODELS ───────────────────────────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'supervisor', 'user'] },
  avatar: String,
  active: { type: Boolean, default: true },
  company: String,
}, { timestamps: true });

const StockSchema = new mongoose.Schema({
  name: String,
  unit: String,
  qty: Number,
  minQty: Number,
  price: Number,
  company: String,
}, { timestamps: true });

const RawMaterialSchema = new mongoose.Schema({
  material: String,
  supplier: String,
  unit: String,
  qty: Number,
  minQty: Number,
  costPerUnit: Number,
  lastPurchase: String,
  company: String,
}, { timestamps: true });

const ProductionSchema = new mongoose.Schema({
  date: String,
  product: String,
  shift: String,
  target: Number,
  produced: Number,
  machine: String,
  supervisor: String,
  status: { type: String, default: 'pending' },
  notes: String,
  company: String,
}, { timestamps: true });

const SalesSchema = new mongoose.Schema({
  date: String,
  customer: String,
  product: String,
  qty: Number,
  unitPrice: Number,
  total: Number,
  status: { type: String, default: 'pending' },
  invoice: String,
  company: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Stock = mongoose.model('Stock', StockSchema);
const RawMaterial = mongoose.model('RawMaterial', RawMaterialSchema);
const Production = mongoose.model('Production', ProductionSchema);
const Sales = mongoose.model('Sales', SalesSchema);

// ─── SEED DATA ────────────────────────────────────────────────────────────────
async function seedData() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.insertMany([
      { name: 'Ahmed Al-Mansoori', username: 'admin', password: 'admin123', role: 'admin', avatar: 'AM', company: 'default' },
      { name: 'Fatima Hassan', username: 'supervisor', password: 'sup123', role: 'supervisor', avatar: 'FH', company: 'default' },
      { name: 'Khalid Ibrahim', username: 'user', password: 'user123', role: 'user', avatar: 'KI', company: 'default' },
    ]);
    console.log('✅ Default users seeded!');
  }

  const stockCount = await Stock.countDocuments();
  if (stockCount === 0) {
    await Stock.insertMany([
      { name: 'Standard Interlock (Grey)', unit: 'sqm', qty: 1240, minQty: 200, price: 28, company: 'default' },
      { name: 'Premium Interlock (Red)', unit: 'sqm', qty: 85, minQty: 150, price: 45, company: 'default' },
      { name: 'Cobblestone Pattern (Beige)', unit: 'sqm', qty: 670, minQty: 100, price: 52, company: 'default' },
      { name: 'Zigzag Interlock (Black)', unit: 'sqm', qty: 320, minQty: 100, price: 38, company: 'default' },
      { name: 'Hexagonal Block (White)', unit: 'sqm', qty: 190, minQty: 200, price: 60, company: 'default' },
    ]);
    console.log('✅ Default stock seeded!');
  }

  const rawCount = await RawMaterial.countDocuments();
  if (rawCount === 0) {
    await RawMaterial.insertMany([
      { material: 'Cement (OPC 53)', supplier: 'Gulf Cement Co.', unit: 'bags', qty: 850, minQty: 200, costPerUnit: 18, lastPurchase: '2024-01-10', company: 'default' },
      { material: 'Sand (Fine)', supplier: 'Desert Sand LLC', unit: 'tons', qty: 42, minQty: 10, costPerUnit: 120, lastPurchase: '2024-01-08', company: 'default' },
      { material: 'Aggregate (10mm)', supplier: 'Rock Arabia', unit: 'tons', qty: 28, minQty: 8, costPerUnit: 95, lastPurchase: '2024-01-05', company: 'default' },
      { material: 'Color Pigment (Red)', supplier: 'ChromaChem UAE', unit: 'kg', qty: 120, minQty: 50, costPerUnit: 35, lastPurchase: '2024-01-09', company: 'default' },
      { material: 'Plasticizer Admixture', supplier: 'SikaTech Gulf', unit: 'liters', qty: 65, minQty: 20, costPerUnit: 22, lastPurchase: '2024-01-07', company: 'default' },
    ]);
    console.log('✅ Default raw materials seeded!');
  }
}

// ─── AUTH ROUTES ──────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password, active: true });
  if (!user) return res.status(401).json({ message: 'Invalid username or password' });
  res.json({ id: user._id, name: user.name, username: user.username, role: user.role, avatar: user.avatar, company: user.company });
});

// ─── USER ROUTES ──────────────────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const { name, username, password, role, company } = req.body;
  const avatar = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const user = new User({ name, username, password, role, avatar, company: company || 'default' });
  await user.save();
  res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// ─── STOCK ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/stock', async (req, res) => {
  const stock = await Stock.find();
  res.json(stock);
});

app.post('/api/stock', async (req, res) => {
  const item = new Stock(req.body);
  await item.save();
  res.json(item);
});

app.put('/api/stock/:id', async (req, res) => {
  const item = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete('/api/stock/:id', async (req, res) => {
  await Stock.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// ─── RAW MATERIAL ROUTES ──────────────────────────────────────────────────────
app.get('/api/raw', async (req, res) => {
  const raw = await RawMaterial.find();
  res.json(raw);
});

app.post('/api/raw', async (req, res) => {
  const item = new RawMaterial(req.body);
  await item.save();
  res.json(item);
});

app.put('/api/raw/:id', async (req, res) => {
  const item = await RawMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete('/api/raw/:id', async (req, res) => {
  await RawMaterial.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// ─── PRODUCTION ROUTES ────────────────────────────────────────────────────────
app.get('/api/production', async (req, res) => {
  const production = await Production.find().sort({ createdAt: -1 });
  res.json(production);
});

app.post('/api/production', async (req, res) => {
  const item = new Production(req.body);
  await item.save();
  res.json(item);
});

app.put('/api/production/:id', async (req, res) => {
  const item = await Production.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete('/api/production/:id', async (req, res) => {
  await Production.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// ─── SALES ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/sales', async (req, res) => {
  const sales = await Sales.find().sort({ createdAt: -1 });
  res.json(sales);
});

app.post('/api/sales', async (req, res) => {
  const item = new Sales(req.body);
  await item.save();
  res.json(item);
});

app.put('/api/sales/:id', async (req, res) => {
  const item = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

app.delete('/api/sales/:id', async (req, res) => {
  await Sales.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
// Worker Report
const WorkerReportSchema = new mongoose.Schema({ date: String, siteId: String, workerName: String, remuneration: Number, workingArea: Number, workAmount: Number, paymentMode: String, materialAmount: Number, notes: String, signatures: Object, addedBy: String }, { timestamps: true });
const WorkerReport = mongoose.model("WorkerReport", WorkerReportSchema);
app.get("/api/workerreport", async (req, res) => { res.json(await WorkerReport.find().sort({ createdAt: -1 })); });
app.post("/api/workerreport", async (req, res) => { const item = new WorkerReport(req.body); await item.save(); res.json(item); });
app.put("/api/workerreport/:id", async (req, res) => { res.json(await WorkerReport.findByIdAndUpdate(req.params.id, req.body, { new: true })); });

// Daily Report
const DailyReportSchema = new mongoose.Schema({
  date: String,
  newSite: String,
  runningSite: String,
  materialSupply: String,
  complaints: String,
  dayNote: String,
  expenses: String,
  addedBy: String
}, { timestamps: true });
const DailyReport = mongoose.model("DailyReport", DailyReportSchema);
app.get("/api/dailyreport", async (req, res) => { res.json(await DailyReport.find().sort({ createdAt: -1 })); });
app.post("/api/dailyreport", async (req, res) => {
  try {
    const item = new DailyReport(req.body);
    await item.save();

    const { newSite, runningSite, completedSite } = req.body;

    if (newSite?.siteName) {
      const exists = await SiteWork.findOne({ customerName: newSite.siteName });
      if (!exists) {
        await new SiteWork({
          customerName: newSite.siteName,
          location: newSite.location || "",
          date: newSite.startDate || req.body.date,
          workStatus: "ongoing",
          totalAmount: +newSite.totalCost || 0,
          paidAmount: +newSite.amountReceived || 0,
          pendingAmount: (+newSite.totalCost || 0) - (+newSite.amountReceived || 0),
          notes: `Client: ${newSite.clientName || ""} | Interlock: ${newSite.interlockType || ""} | Area: ${newSite.totalWorkArea || ""} sqft`,
          addedBy: req.body.addedBy,
          company: "Al-Noor"
        }).save();
      }
    }

    if (runningSite?.siteName) {
      await SiteWork.findOneAndUpdate(
        { customerName: runningSite.siteName },
        { workStatus: "ongoing", paidAmount: +runningSite.amountReceived || 0, totalAmount: +runningSite.totalCost || 0, pendingAmount: (+runningSite.totalCost || 0) - (+runningSite.amountReceived || 0) },
        { upsert: true }
      );
    }

    if (completedSite?.siteName) {
      await SiteWork.findOneAndUpdate(
        { customerName: completedSite.siteName },
        { workStatus: "completed", paidAmount: +completedSite.totalAmountReceived || 0, totalAmount: +completedSite.totalCost || 0, pendingAmount: +completedSite.finalPendingAmount || 0 },
        { upsert: true }
      );
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/dailyreport/:id", async (req, res) => { res.json(await DailyReport.findByIdAndUpdate(req.params.id, req.body, { new: true })); });

// Work Plan
const WorkPlanSchema = new mongoose.Schema({ fromDate: String, toDate: String, site: String, plannedWork: String, workersAllocated: String, materialsNeeded: String, estimatedCost: Number, paymentPlan: String, notes: String, status: String, addedBy: String }, { timestamps: true });
const WorkPlan = mongoose.model("WorkPlan", WorkPlanSchema);
app.get("/api/workplan", async (req, res) => { res.json(await WorkPlan.find().sort({ createdAt: -1 })); });
app.post("/api/workplan", async (req, res) => { const item = new WorkPlan(req.body); await item.save(); res.json(item); });
app.put("/api/workplan/:id", async (req, res) => { res.json(await WorkPlan.findByIdAndUpdate(req.params.id, req.body, { new: true })); });
// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
// ─── SITE WORK ROUTES ─────────────────────────────────────────────────────────
const SiteWorkSchema = new mongoose.Schema({
  customerName: String, location: String, date: String,
  workStatus: { type: String, default: "ongoing" },
  items: Array, totalAmount: Number, paidAmount: Number,
  pendingAmount: Number, notes: String, addedBy: String,
  company: String,
}, { timestamps: true });
const SiteWork = mongoose.model("SiteWork", SiteWorkSchema);

app.get("/api/sitework", async (req, res) => { res.json(await SiteWork.find().sort({ createdAt: -1 })); });
app.post("/api/sitework", async (req, res) => { const item = new SiteWork(req.body); await item.save(); res.json(item); });
app.put("/api/sitework/:id", async (req, res) => { res.json(await SiteWork.findByIdAndUpdate(req.params.id, req.body, { new: true })); });
app.delete("/api/sitework/:id", async (req, res) => { await SiteWork.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); });

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await seedData();
});
