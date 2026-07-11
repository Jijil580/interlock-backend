const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err));

const UserSchema = new mongoose.Schema({ name:String, username:{type:String,unique:true}, password:String, role:{type:String,enum:['admin','supervisor','user']}, avatar:String, active:{type:Boolean,default:true}, company:String }, {timestamps:true});
const StockSchema = new mongoose.Schema({ name:String, category:String, itemId:String, shape:String, color:String, size:String, thickness:String, unit:String, quantity:Number, minStock:Number, price:Number, company:String }, {timestamps:true});
const RawMaterialSchema = new mongoose.Schema({ name:String, material:String, supplier:String, unit:String, quantity:Number, qty:Number, price:Number, costPerUnit:Number, lastPurchase:String, company:String }, {timestamps:true});
const ProductionSchema = new mongoose.Schema({ date:String, product:String, shift:String, target:Number, produced:Number, machine:String, supervisor:String, status:{type:String,default:'pending'}, notes:String, note:String, company:String }, {timestamps:true});
const SalesSchema = new mongoose.Schema({ date:String, customer:String, mobileNumber:String, address:String, product:String, itemId:String, category:String, shape:String, color:String, size:String, thickness:String, interlockDetails:String, quantity:Number, unit:String, price:Number, unitPrice:Number, discount:{type:Number,default:0}, total:Number, amountPaid:{type:Number,default:0}, amountPending:{type:Number,default:0}, paymentMode:String, invoiceNumber:String, status:{type:String,default:'pending'}, addedBy:String, company:String }, {timestamps:true});
const CustomerSchema = new mongoose.Schema({ mobile:{type:String,unique:true}, name:String, address:String, gstNumber:String, notes:String, totalPurchases:{type:Number,default:0}, totalSalesAmount:{type:Number,default:0}, totalDiscount:{type:Number,default:0}, totalPaid:{type:Number,default:0}, totalPending:{type:Number,default:0}, totalQuantity:{type:Number,default:0}, company:String, addedBy:String }, {timestamps:true});
const SiteWorkSchema = new mongoose.Schema({ customerName:String, phone:String, siteLocation:String, location:String, interlockType:String, interlockColor:String, selectedWorkers:[String], startDate:String, endDate:String, status:{type:String,default:'running'}, workUnit:String, workSize:String, ratePerUnit:String, baseWorkCost:String, extraWork:Array, extraMaterials:Array, materialCost:String, laborCost:String, totalCost:String, payments:Array, totalReceived:Number, pendingAmount:String, paymentStatus:{type:String,default:'pending'}, paymentMode:String, note:String, addedBy:String, workStatus:String, totalAmount:Number, paidAmount:Number, company:String }, {timestamps:true});
const WorkerReportSchema = new mongoose.Schema({ siteName:String, phoneNo:String, startingDate:String, workerName:String, totalArea:String, workingCost:String, extraWork:String, extraMaterial:String, totalWorkingArea:String, totalAmount:String, note:String, paymentMode:String, upiId:String, bankName:String, bankBranch:String, bankAccount:String, amountReceivedBy:String, materialSupply:String, materialType:String, signatures:{supervisor:Boolean,office:Boolean,admin:Boolean}, addedBy:String }, {timestamps:true});
const DailyReportSchema = new mongoose.Schema({ date:String, siteName:String, siteId:String, siteStatus:String, workersCount:String, totalArea:String, completedToday:String, totalCompleted:String, interlockType:String, dayNotes:String, materialsUnloaded:String, materialQty:String, equipment:String, supplierName:String, materialRemarks:String, extraWorkDesc:String, extraWorkQty:String, extraWorkCost:String, extraWorkRemarks:String, workerEntries:[{workerName:String,attendance:String,dutyArea:String,workDone:String,salary:Number,amountEarned:Number,paymentGiven:Number,pending:Number,remarks:String,workCategory:String,workArea:Number,unit:String,rate:Number,paymentMode:String}], payments:Array, totalPayments:Number, totalReceived:Number, complaints:String, actionTaken:String, complaintRemarks:String, addedBy:String, newSite:String, runningSite:String, workersDetail:String, materialSupply:String, dayNote:String, expenses:String, workerPayments:[{workerName:String,amount:Number,date:String,note:String}] }, {timestamps:true});
const WorkPlanSchema = new mongoose.Schema({ date:String, siteName:String, task:String, workers:String, materials:String, note:String, status:{type:String,default:'planned'}, fromDate:String, toDate:String, site:String, plannedWork:String, supervisor:String, workersAllocated:String, materialsNeeded:String, estimatedCost:Number, paymentPlan:String, notes:String, archived:{type:Boolean,default:false}, addedBy:String }, {timestamps:true});
const WorkerSchema = new mongoose.Schema({ name:String, phone:String, address:String, role:String, workerType:String, workerCategory:String, status:{type:String,default:'Active'}, workLocationType:String, paymentType:String, customPaymentType:String, rateType:String, rateAmount:Number, totalProduction:{type:Number,default:0}, totalEarnings:{type:Number,default:0}, totalPaid:{type:Number,default:0}, totalPending:{type:Number,default:0}, addedBy:String }, {timestamps:true});
const WorkerPaymentSchema = new mongoose.Schema({ workerName:String, amount:Number, date:String, note:String, addedBy:String, source:String, reportDate:String }, {timestamps:true});
const PurchaseSchema = new mongoose.Schema({ date:String, supplierName:String, supplierPhone:String, supplierMobile:String, supplierAddress:String, itemName:String, itemType:String, quantity:String, unit:String, unitPrice:String, totalAmount:Number, amountPaid:{type:Number,default:0}, amountPending:{type:Number,default:0}, paymentMode:String, vehicleNumber:String, vehicleType:String, driverName:String, driverPhone:String, deliveryAddress:String, note:String, addedBy:String }, {timestamps:true});
const SupplierSchema = new mongoose.Schema({ name:String, mobile:String, phone:String, address:String, location:String, materialType:String, materials:[String], customMaterial:String, gstNumber:String, notes:String, note:String, totalPurchases:{type:Number,default:0}, totalPurchaseAmount:{type:Number,default:0}, totalPaid:{type:Number,default:0}, totalPending:{type:Number,default:0}, addedBy:String }, {timestamps:true});
const MasterDataSchema = new mongoose.Schema({ name:String, category:String, shape:String, color:String, size:String, thickness:String, pricePerSqft:Number, pricePerSqm:Number, unit:String, price:Number, stock:Number, rate:Number, rateType:String, description:String, notes:String, addedBy:String }, {timestamps:true});
const ProductionSiteSchema = new mongoose.Schema({
  date:String, shift:String, workerId:String, workerName:String,
  itemId:String, itemName:String, category:String, shape:String, color:String, size:String, thickness:String, unitType:String,
  producedQty:Number, unit:String, productionRate:Number, totalAmount:Number,
  paymentGiven:Number, amountPending:Number, remarks:String,
  workType:String, notes:String, attendance:Array, totalCost:Number, addedBy:String,
}, {timestamps:true});




const User = mongoose.model('User', UserSchema);
const Stock = mongoose.model('Stock', StockSchema);
const RawMaterial = mongoose.model('RawMaterial', RawMaterialSchema);
const Production = mongoose.model('Production', ProductionSchema);
const Sales = mongoose.model('Sales', SalesSchema);
const Customer = mongoose.model('Customer', CustomerSchema);

function normalizeMobile(m) {
  return String(m || '').replace(/\D/g, '').slice(-10);
}

function escapeRegex(v) {
  return String(v || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildItemSummary(records, nameField) {
  const map = {};
  records.forEach(r => {
    const item = r[nameField] || 'Other';
    if (!map[item]) map[item] = { item, quantity: 0, unit: r.unit || '' };
    map[item].quantity += +(r.quantity) || 0;
    if (r.unit) map[item].unit = r.unit;
  });
  return Object.values(map);
}

function summarizeSales(purchases, customer) {
  const mobile = customer?.mobile || purchases[0]?.mobileNumber || '';
  return {
    name: customer?.name || purchases[0]?.customer || '',
    mobile,
    address: customer?.address || purchases[0]?.address || '',
    gstNumber: customer?.gstNumber || '',
    notes: customer?.notes || '',
    totalPurchases: purchases.length,
    totalSalesAmount: purchases.reduce((a, s) => a + (+(s.total) || 0), 0),
    totalDiscount: purchases.reduce((a, s) => a + (+(s.discount) || 0), 0),
    totalPaid: purchases.reduce((a, s) => a + (+(s.amountPaid) || 0), 0),
    totalPending: purchases.reduce((a, s) => a + (+(s.amountPending) || 0), 0),
    totalQuantity: purchases.reduce((a, s) => a + (+(s.quantity) || 0), 0),
  };
}

async function buildCustomerLedger(mobile, dateFilter = {}) {
  const customer = await Customer.findOne({ mobile });
  const filter = { mobileNumber: mobile };
  if (dateFilter.fromDate || dateFilter.toDate) {
    filter.date = {};
    if (dateFilter.fromDate) filter.date.$gte = dateFilter.fromDate;
    if (dateFilter.toDate) filter.date.$lte = dateFilter.toDate;
  }
  const purchases = await Sales.find(filter).sort({ createdAt: -1 });
  if (!customer && !purchases.length) return null;
  return {
    customer: summarizeSales(purchases, customer),
    itemSummary: buildItemSummary(purchases, 'product'),
    purchases,
  };
}

function summarizePurchases(records, supplier) {
  const mobile = supplier?.mobile || supplier?.phone || records[0]?.supplierMobile || records[0]?.supplierPhone || '';
  return {
    name: supplier?.name || records[0]?.supplierName || '',
    mobile,
    address: supplier?.address || supplier?.location || records[0]?.supplierAddress || '',
    gstNumber: supplier?.gstNumber || '',
    materialType: supplier?.materialType || '',
    totalPurchases: records.length,
    totalPurchaseAmount: records.reduce((a, p) => a + (+(p.totalAmount) || 0), 0),
    totalPaid: records.reduce((a, p) => a + (+(p.amountPaid) || 0), 0),
    totalPending: records.reduce((a, p) => a + (+(p.amountPending) || 0), 0),
  };
}

async function buildSupplierLedger({ mobile, name, dateFilter = {} }) {
  const filter = {};
  if (mobile) {
    const m = normalizeMobile(mobile);
    filter.$or = [{ supplierMobile: m }, { supplierPhone: m }];
  } else if (name) {
    filter.supplierName = { $regex: name, $options: 'i' };
  } else return null;
  if (dateFilter.fromDate || dateFilter.toDate) {
    filter.date = {};
    if (dateFilter.fromDate) filter.date.$gte = dateFilter.fromDate;
    if (dateFilter.toDate) filter.date.$lte = dateFilter.toDate;
  }
  const purchases = await Purchase.find(filter).sort({ createdAt: -1 });
  if (!purchases.length) return null;
  const m = mobile ? normalizeMobile(mobile) : normalizeMobile(purchases[0].supplierMobile || purchases[0].supplierPhone);
  let supplier = m ? await Supplier.findOne({ $or: [{ mobile: m }, { phone: m }] }) : null;
  if (!supplier && name) supplier = await Supplier.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
  return {
    supplier: summarizePurchases(purchases, supplier),
    materialSummary: buildItemSummary(purchases, 'itemName'),
    purchases,
  };
}

async function upsertCustomerFromSale(sale, saveToMaster = true) {
  if (!saveToMaster) return null;
  const mobile = normalizeMobile(sale.mobileNumber);
  if (!mobile || mobile.length < 10) return null;
  const paid = +(sale.amountPaid) || 0;
  const pending = +(sale.amountPending) || 0;
  const total = +(sale.total) || 0;
  const discount = +(sale.discount) || 0;
  const qty = +(sale.quantity) || 0;
  let customer = await Customer.findOne({ mobile });
  if (!customer) {
    customer = await Customer.create({
      mobile,
      name: sale.customer || '',
      address: sale.address || '',
      gstNumber: sale.gstNumber || '',
      notes: sale.customerNotes || '',
      totalPurchases: 1,
      totalSalesAmount: total,
      totalDiscount: discount,
      totalPaid: paid,
      totalPending: pending,
      totalQuantity: qty,
      company: sale.company || 'default',
      addedBy: sale.addedBy || '',
    });
  } else {
    if (sale.customer) customer.name = sale.customer;
    if (sale.address) customer.address = sale.address;
    if (sale.gstNumber) customer.gstNumber = sale.gstNumber;
    customer.totalPurchases += 1;
    customer.totalSalesAmount += total;
    customer.totalDiscount += discount;
    customer.totalPaid += paid;
    customer.totalPending += pending;
    customer.totalQuantity += qty;
    await customer.save();
  }
  return customer;
}

async function upsertSupplierFromPurchase(purchase, saveToMaster = true) {
  if (!saveToMaster) return null;
  const mobile = normalizeMobile(purchase.supplierMobile || purchase.supplierPhone);
  const name = purchase.supplierName;
  if (!name) return null;
  const paid = +(purchase.amountPaid) || 0;
  const pending = +(purchase.amountPending) || 0;
  const total = +(purchase.totalAmount) || 0;
  let supplier = null;
  if (mobile) supplier = await Supplier.findOne({ $or: [{ mobile }, { phone: mobile }] });
  if (!supplier) supplier = await Supplier.findOne({ name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
  if (!supplier) {
    supplier = await Supplier.create({
      name,
      mobile: mobile || '',
      phone: mobile || '',
      address: purchase.supplierAddress || '',
      location: purchase.supplierAddress || '',
      materialType: purchase.itemName || '',
      materials: purchase.itemName ? [purchase.itemName] : [],
      totalPurchases: 1,
      totalPurchaseAmount: total,
      totalPaid: paid,
      totalPending: pending,
      addedBy: purchase.addedBy || '',
    });
  } else {
    if (purchase.supplierAddress) { supplier.address = purchase.supplierAddress; supplier.location = purchase.supplierAddress; }
    if (mobile) { supplier.mobile = mobile; supplier.phone = mobile; }
    supplier.totalPurchases += 1;
    supplier.totalPurchaseAmount += total;
    supplier.totalPaid += paid;
    supplier.totalPending += pending;
    if (purchase.itemName) {
      const mats = supplier.materials || [];
      if (!mats.includes(purchase.itemName)) supplier.materials = [...mats, purchase.itemName];
    }
    await supplier.save();
  }
  return supplier;
}
const SiteWork = mongoose.model('SiteWork', SiteWorkSchema);
const WorkerReport = mongoose.model('WorkerReport', WorkerReportSchema);
const DailyReport = mongoose.model('DailyReport', DailyReportSchema);
const WorkPlan = mongoose.model('WorkPlan', WorkPlanSchema);
const Worker = mongoose.model('Worker', WorkerSchema);
const WorkerPayment = mongoose.model('WorkerPayment', WorkerPaymentSchema);
const Purchase = mongoose.model('Purchase', PurchaseSchema);
const Supplier = mongoose.model('Supplier', SupplierSchema);
const MasterInterlock = mongoose.model('MasterInterlock', MasterDataSchema);
const MasterMaterial = mongoose.model('MasterMaterial', new mongoose.Schema({...MasterDataSchema.obj},{timestamps:true}));
const MasterLabor = mongoose.model('MasterLabor', new mongoose.Schema({...MasterDataSchema.obj},{timestamps:true}));
const MasterExtraWork = mongoose.model('MasterExtraWork', new mongoose.Schema({...MasterDataSchema.obj},{timestamps:true}));
const ProductionSiteEntry = mongoose.model('ProductionSiteEntry', ProductionSiteSchema);

async function seedData() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.insertMany([
      {name:'Ahmed Al-Mansoori',username:'admin',password:'admin123',role:'admin',avatar:'AM',company:'default'},
      {name:'Fatima Hassan',username:'supervisor',password:'sup123',role:'supervisor',avatar:'FH',company:'default'},
      {name:'Khalid Ibrahim',username:'user',password:'user123',role:'user',avatar:'KI',company:'default'},
    ]);
    console.log('✅ Default users seeded!');
  }
}

app.get('/api/users', async(req,res)=>res.json(await User.find({},'-password')));
app.post('/api/users', async(req,res)=>{ try{ const {name,username,password,role,company}=req.body; const avatar=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); res.json(await User.create({name,username,password,role,avatar,company:company||'default'})); }catch(e){res.status(400).json({message:e.message});} });
app.put('/api/users/:id', async(req,res)=>res.json(await User.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.post('/api/login', async(req,res)=>{
  try {
    const {username,password}=req.body;
    const user = await User.findOne({username,password,active:true});
    if(!user) return res.status(401).json({message:'Invalid credentials'});
    res.json({_id:user._id,name:user.name,username:user.username,role:user.role,avatar:user.avatar,company:user.company});
  } catch(e){ res.status(500).json({message:'Server error'}); }
});

app.get('/api/stock', async(req,res)=>res.json(await Stock.find()));
app.post('/api/stock', async(req,res)=>{
  try {
    const body = { ...req.body };
    const category = body.category || '';
    const existing = await Stock.findOne({
      name: { $regex: `^${escapeRegex(String(body.name || '').trim())}$`, $options: 'i' },
      unit: body.unit || 'nos',
      ...(category ? { category } : { $or: [{ category: '' }, { category: { $exists: false } }] })
    });
    if (existing) {
      existing.quantity = (+(existing.quantity) || 0) + (+(body.quantity) || 0);
      existing.minStock = body.minStock ?? existing.minStock;
      existing.price = body.price ?? existing.price;
      await existing.save();
      return res.json(existing);
    }
    res.json(await Stock.create(body));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/stock/:id', async(req,res)=>res.json(await Stock.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete('/api/stock/:id', async(req,res)=>{await Stock.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/raw', async(req,res)=>res.json(await RawMaterial.find()));
app.post('/api/raw', async(req,res)=>res.json(await RawMaterial.create(req.body)));
app.put('/api/raw/:id', async(req,res)=>res.json(await RawMaterial.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete('/api/raw/:id', async(req,res)=>{await RawMaterial.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/production', async(req,res)=>res.json(await Production.find().sort({createdAt:-1})));
app.post('/api/production', async(req,res)=>res.json(await Production.create(req.body)));
app.put('/api/production/:id', async(req,res)=>res.json(await Production.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete('/api/production/:id', async(req,res)=>{await Production.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/sales', async(req,res)=>{
  try {
    const { mobile, customer, date, fromDate, toDate, invoice } = req.query;
    const filter = {};
    if (mobile) filter.mobileNumber = normalizeMobile(mobile);
    if (customer) filter.customer = { $regex: customer, $options: 'i' };
    if (invoice) filter.invoiceNumber = { $regex: invoice, $options: 'i' };
    if (date) filter.date = date;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }
    res.json(await Sales.find(filter).sort({createdAt:-1}));
  } catch(e) { res.status(500).json({ message: e.message }); }
});
app.post('/api/sales', async(req,res)=>{
  try {
    const mobile = normalizeMobile(req.body.mobileNumber);
    if (!mobile || mobile.length < 10) return res.status(400).json({ message: 'Valid mobile number is required' });
    const total = +(req.body.total) || 0;
    const discount = +(req.body.discount) || 0;
    const amountPaid = +(req.body.amountPaid) || 0;
    const amountPending = total - amountPaid;
    const status = amountPending <= 0 ? 'paid' : amountPaid > 0 ? 'partial' : 'pending';
    const sale = await Sales.create({ ...req.body, mobileNumber: mobile, total, discount, amountPaid, amountPending, status });
    await adjustStockFromSale(sale, -1);
    await upsertCustomerFromSale(sale, req.body.saveToCustomerMaster !== false);
    res.json(sale);
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/sales/:id', async(req,res)=>{
  try {
    const oldSale = await Sales.findById(req.params.id);
    if (oldSale) await adjustStockFromSale(oldSale, 1);
    const sale = await Sales.findByIdAndUpdate(req.params.id, req.body, {new:true});
    if (sale) await adjustStockFromSale(sale, -1);
    res.json(sale);
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.delete('/api/sales/:id', async(req,res)=>{
  try {
    const sale = await Sales.findById(req.params.id);
    if (sale) await adjustStockFromSale(sale, 1);
    await Sales.findByIdAndDelete(req.params.id);
    res.json({ok:true});
  } catch(e) { res.status(400).json({ message: e.message }); }
});

app.get('/api/customers', async(req,res)=>res.json(await Customer.find().sort({ name: 1 })));
app.post('/api/customers', async(req,res)=>{
  try {
    const mobile = normalizeMobile(req.body.mobile);
    if (!mobile || mobile.length < 10) return res.status(400).json({ message: 'Valid mobile number is required' });
    if (!req.body.name) return res.status(400).json({ message: 'Customer name is required' });
    res.json(await Customer.create({ ...req.body, mobile }));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/customers/:id', async(req,res)=>{
  try {
    const data = { ...req.body };
    if (data.mobile) data.mobile = normalizeMobile(data.mobile);
    res.json(await Customer.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.delete('/api/customers/:id', async(req,res)=>{ await Customer.findByIdAndDelete(req.params.id); res.json({ ok: true }); });

app.get('/api/customers/mobile/:mobile', async(req,res)=>{
  try {
    const mobile = normalizeMobile(req.params.mobile);
    if (!mobile) return res.status(400).json({ message: 'Invalid mobile number' });
    const { fromDate, toDate } = req.query;
    const ledger = await buildCustomerLedger(mobile, { fromDate, toDate });
    if (!ledger) return res.json({ customer: null, purchases: [], itemSummary: [] });
    res.json(ledger);
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/customers/search', async(req,res)=>{
  try {
    const { name, mobile, fromDate, toDate } = req.query;
    if (mobile) {
      const ledger = await buildCustomerLedger(normalizeMobile(mobile), { fromDate, toDate });
      return res.json(ledger || { customer: null, purchases: [], itemSummary: [] });
    }
    if (name) {
      const customers = await Customer.find({ name: { $regex: name, $options: 'i' } });
      if (customers.length === 1) {
        const ledger = await buildCustomerLedger(customers[0].mobile, { fromDate, toDate });
        return res.json(ledger);
      }
      return res.json({ customers: customers.map(c => ({ _id: c._id, name: c.name, mobile: c.mobile, totalPending: c.totalPending })) });
    }
    res.json({ customers: await Customer.find().sort({ name: 1 }) });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/customers/reports', async(req,res)=>{
  try {
    const { type } = req.query;
    const customers = await Customer.find().sort({ name: 1 });
    const allSales = await Sales.find();
    const itemMap = {};
    allSales.forEach(s => {
      const key = s.product || 'Other';
      if (!itemMap[key]) itemMap[key] = { item: key, quantity: 0, unit: s.unit || '', amount: 0 };
      itemMap[key].quantity += +(s.quantity) || 0;
      itemMap[key].amount += +(s.total) || 0;
    });
    let list = customers.map(c => ({
      _id: c._id, name: c.name, mobile: c.mobile,
      totalSalesAmount: c.totalSalesAmount, totalPaid: c.totalPaid, totalPending: c.totalPending,
    }));
    if (type === 'pending') list = list.filter(c => (+(c.totalPending) || 0) > 0);
    if (type === 'paid') list = list.filter(c => (+(c.totalPending) || 0) <= 0 && (+(c.totalSalesAmount) || 0) > 0);
    res.json({ customers: list, itemWise: Object.values(itemMap) });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/sitework', async(req,res)=>{
  const sites = await SiteWork.find().sort({createdAt:-1});
  for (const site of sites) await recalcSiteFinancials(site);
  res.json(sites);
});
app.post('/api/sitework', async(req,res)=>{
  const body = { ...req.body };
  delete body.advancePaid;
  const workerValidation = await validateSiteWorkAssignedWorkers(body);
  if (workerValidation) return res.status(400).json({ message: workerValidation });
  const site = await SiteWork.create(body);
  res.json(await recalcSiteFinancials(site));
});
app.put('/api/sitework/:id', async(req,res)=>{
  const body = { ...req.body };
  delete body.advancePaid;
  const workerValidation = await validateSiteWorkAssignedWorkers(body);
  if (workerValidation) return res.status(400).json({ message: workerValidation });
  const site = await SiteWork.findByIdAndUpdate(req.params.id,body,{new:true});
  res.json(await recalcSiteFinancials(site));
});
app.delete('/api/sitework/:id', async(req,res)=>{await SiteWork.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/workerreport', async(req,res)=>res.json(await WorkerReport.find().sort({createdAt:-1})));
app.post('/api/workerreport', async(req,res)=>res.json(await WorkerReport.create(req.body)));
app.put('/api/workerreport/:id', async(req,res)=>res.json(await WorkerReport.findByIdAndUpdate(req.params.id,req.body,{new:true})));

app.get('/api/dailyreport', async(req,res)=>res.json(await DailyReport.find().sort({createdAt:-1})));
app.post('/api/dailyreport', async(req,res)=>{
  try {
    const body = normalizeDailyReportBody(req.body);
    const duplicate = await findDuplicateWorkerEntry(body);
    if (duplicate) return res.status(409).json({
      message: 'Worker work entry already exists for this date and site.',
      existingReportId: duplicate._id
    });
    const workerValidation = await validateDailyReportSiteWorkers(body);
    if (workerValidation) return res.status(400).json({ message: workerValidation });
    const report = await DailyReport.create(body);
    if (report.workerEntries && report.workerEntries.length > 0) {
      for (const we of report.workerEntries) {
        if (we.workerName) {
          await syncWorkerTotals(we.workerName);
        }
      }
    }
    if (report.siteId) await recalcSiteFinancials(report.siteId);
    else if (report.siteName) {
      const site = await SiteWork.findOne({ customerName: report.siteName });
      if (site) await recalcSiteFinancials(site);
    }
    res.json(report);
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/dailyreport/:id', async(req,res)=>{
  try {
    const oldReport = await DailyReport.findById(req.params.id);
    const body = normalizeDailyReportBody(req.body);
    const duplicate = await findDuplicateWorkerEntry(body, req.params.id);
    if (duplicate) return res.status(409).json({
      message: 'Worker work entry already exists for this date and site.',
      existingReportId: duplicate._id
    });
    const workerValidation = await validateDailyReportSiteWorkers(body);
    if (workerValidation) return res.status(400).json({ message: workerValidation });
    const newReport = await DailyReport.findByIdAndUpdate(req.params.id,body,{new:true});
    const workersToSync = new Set();
    if (oldReport && oldReport.workerEntries) {
      oldReport.workerEntries.forEach(we => { if (we.workerName) workersToSync.add(we.workerName); });
    }
    if (newReport && newReport.workerEntries) {
      newReport.workerEntries.forEach(we => { if (we.workerName) workersToSync.add(we.workerName); });
    }
    for (const name of workersToSync) {
      await syncWorkerTotals(name);
    }
    const siteIds = new Set();
    [oldReport, newReport].forEach(r => {
      if (r?.siteId) siteIds.add(String(r.siteId));
      else if (r?.siteName) siteIds.add(`name:${r.siteName}`);
    });
    for (const key of siteIds) {
      if (key.startsWith('name:')) {
        const site = await SiteWork.findOne({ customerName: key.slice(5) });
        if (site) await recalcSiteFinancials(site);
      } else await recalcSiteFinancials(key);
    }
    res.json(newReport);
  } catch(e) { res.status(400).json({ message: e.message }); }
});

app.get('/api/workplan', async(req,res)=>{
  const { archive, role } = req.query;
  const cutoff = currentPlanningWindow();
  if (archive === 'true') {
    if (role !== 'admin') return res.status(403).json({ message: 'Archive visible only to Admin' });
    return res.json(await WorkPlan.find({ $or: [{ archived: true }, { date: { $lt: cutoff } }] }).sort({date:-1, createdAt:-1}));
  }
  res.json(await WorkPlan.find({ archived: { $ne: true }, $or: [{ date: { $gte: cutoff } }, { date: '' }, { date: null }] }).sort({date:-1, createdAt:-1}));
});
app.post('/api/workplan', async(req,res)=>res.json(await WorkPlan.create(req.body)));
app.put('/api/workplan/:id', async(req,res)=>res.json(await WorkPlan.findByIdAndUpdate(req.params.id,req.body,{new:true})));

function normalizeWorkerType(worker) {
  const raw = String(worker?.workerType || worker?.workerCategory || '').toLowerCase();
  return raw.includes('production') ? 'Production Worker' : 'Site Worker';
}

function normalizeWorkerPayload(body) {
  const workerType = normalizeWorkerType(body);
  return { ...body, workerType, workerCategory: workerType, status: body.status || 'Active' };
}

function isWorkerActive(worker) {
  return String(worker?.status || 'Active').toLowerCase() !== 'inactive';
}

app.get('/api/workers', async(req,res)=>{
  const { type, status } = req.query;
  let workers = await Worker.find().sort({name:1}).lean();
  workers = workers.map(w => ({ ...w, workerType: normalizeWorkerType(w), workerCategory: normalizeWorkerType(w), status: w.status || 'Active' }));
  if (type) workers = workers.filter(w => normalizeWorkerType(w).toLowerCase() === String(type).toLowerCase());
  if (status) workers = workers.filter(w => String(w.status || 'Active').toLowerCase() === String(status).toLowerCase());
  res.json(workers);
});
app.post('/api/workers', async(req,res)=>res.json(await Worker.create(normalizeWorkerPayload(req.body))));
app.put('/api/workers/:id', async(req,res)=>res.json(await Worker.findByIdAndUpdate(req.params.id,normalizeWorkerPayload(req.body),{new:true})));
app.delete('/api/workers/:id', async(req,res)=>{await Worker.findByIdAndDelete(req.params.id);res.json({ok:true});});

function normKey(v) {
  return String(v || '').trim().toLowerCase();
}

function normalizeWorkerEntry(we = {}) {
  const workArea = +(we.workArea || 0) || 0;
  const rate = +(we.rate || 0) || 0;
  const calculatedAmount = workArea * rate;
  const rawEarned = we.amountEarned ?? we.salary ?? calculatedAmount;
  const amountEarned = +(rawEarned || 0) || calculatedAmount;
  const rawPayment = we.paymentGiven ?? we.paidAmount ?? we.amountPaid ?? we.payment ?? 0;
  const paymentGiven = +(rawPayment || 0) || 0;
  const pending = Math.max(0, amountEarned - paymentGiven);
  return {
    ...we,
    workArea,
    rate,
    salary: amountEarned,
    amountEarned,
    paymentGiven,
    pending
  };
}

function normalizeDailyReportBody(body = {}) {
  return {
    ...body,
    payments: (body.payments || []).filter(p => p.type !== 'Worker Payment'),
    workerEntries: (body.workerEntries || []).map(normalizeWorkerEntry)
  };
}

async function findDuplicateWorkerEntry(report, excludeId) {
  const entries = (report.workerEntries || []).filter(we => we.workerName && we.workCategory);
  if (!report.date || !report.siteName || entries.length === 0) return null;

  const seen = new Set();
  for (const we of entries) {
    const key = `${normKey(we.workerName)}|${normKey(we.workCategory)}`;
    if (seen.has(key)) return { _id: excludeId || 'current-report' };
    seen.add(key);
  }

  const sameDayReports = await DailyReport.find({
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    date: report.date,
    $or: [
      { siteName: report.siteName },
      ...(report.siteId ? [{ siteId: report.siteId }] : [])
    ]
  });

  return sameDayReports.find(r =>
    (r.workerEntries || []).some(existing =>
      entries.some(incoming =>
        normKey(existing.workerName) === normKey(incoming.workerName) &&
        normKey(existing.workCategory) === normKey(incoming.workCategory)
      )
    )
  ) || null;
}

async function validateDailyReportSiteWorkers(report) {
  const entries = (report.workerEntries || []).filter(we => we.workerName);
  if (!entries.length) return null;
  const site = report.siteId ? await SiteWork.findById(report.siteId).lean() : await SiteWork.findOne({ customerName: report.siteName }).lean();
  if (!site) return null;
  const assigned = new Set((site.selectedWorkers || []).map(name => normKey(name)));
  for (const entry of entries) {
    if (!assigned.has(normKey(entry.workerName))) return `${entry.workerName} is not assigned to this site.`;
    const worker = await Worker.findOne({ name: entry.workerName }).lean();
    if (!worker || normalizeWorkerType(worker) !== 'Site Worker' || !isWorkerActive(worker)) {
      return `${entry.workerName} is not an active site worker.`;
    }
  }
  return null;
}

async function validateSiteWorkAssignedWorkers(site) {
  const assigned = site.selectedWorkers || [];
  for (const name of assigned) {
    const worker = await Worker.findOne({ name }).lean();
    if (!worker || normalizeWorkerType(worker) !== 'Site Worker' || !isWorkerActive(worker)) {
      return `${name} is not an active site worker.`;
    }
  }
  return null;
}

function stockKeyFromProduction(itemName, color, category) {
  const name = String(itemName || '').trim();
  const col = String(color || '').trim();
  const cat = String(category || '').trim();
  const suffix = [col].filter(Boolean).join(', ');
  const item = suffix ? `${name} (${suffix})` : name;
  return cat ? `${cat} - ${item}` : item;
}

function stockCandidateNames(itemName, color, category) {
  return [...new Set([
    stockKeyFromProduction(itemName, color, category),
    stockKeyFromProduction(itemName, color, ''),
    String(itemName || '').trim()
  ].filter(Boolean))];
}

async function findStockCandidates({ itemName, product, color, category, itemId }) {
  const name = itemName || product;
  const names = stockCandidateNames(name, color, category);
  const filters = [];
  if (itemId) filters.push({ itemId: String(itemId) });
  filters.push({ name: { $in: names } });
  if (category) filters.push({ category, name: { $in: names } });
  return Stock.find({ $or: filters }).sort({ itemId: -1, category: -1, createdAt: 1 });
}

async function updateStockFromProduction(production) {
  const { itemName, producedQty, unit, unitType, color, category, itemId, shape, size, thickness } = production || {};
  const qty = +(producedQty) || 0;
  if (!itemName || !qty) return null;
  const stockName = stockKeyFromProduction(itemName, color, category);
  const candidates = await findStockCandidates({ itemName, color, category, itemId });
  let stock = candidates[0];
  if (stock) {
    stock.quantity = (+(stock.quantity) || 0) + qty;
    stock.name = stock.name || stockName;
    stock.category = stock.category || category || '';
    stock.itemId = stock.itemId || itemId || '';
    stock.shape = stock.shape || shape || '';
    stock.color = stock.color || color || '';
    stock.size = stock.size || size || '';
    stock.thickness = stock.thickness || thickness || '';
    if (unit || unitType) stock.unit = unit || unitType;
    await stock.save();
  } else {
    stock = await Stock.create({
      name: stockName, category: category || '', itemId: itemId || '',
      shape: shape || '', color: color || '', size: size || '', thickness: thickness || '',
      quantity: qty, unit: unit || unitType || 'sqft', minStock: 0, price: 0
    });
  }
  return stock;
}

async function adjustStockFromSale(sale, direction = -1) {
  const qty = (+(sale?.quantity) || 0) * direction;
  const itemName = sale?.product || sale?.itemName;
  if (!itemName || !qty) return null;
  const category = sale?.category || '';
  const stockName = stockKeyFromProduction(itemName, sale?.color, category);
  const candidates = await findStockCandidates({ itemName, color: sale?.color, category, itemId: sale?.itemId });
  if (candidates.length) {
    let remaining = Math.abs(qty);
    for (const stock of candidates) {
      if (remaining <= 0) break;
      const current = +(stock.quantity) || 0;
      const change = qty < 0 ? -Math.min(current, remaining) : remaining;
      stock.quantity = current + change;
      remaining -= Math.abs(change);
      stock.category = stock.category || category;
      stock.itemId = stock.itemId || sale?.itemId || '';
      stock.shape = stock.shape || sale?.shape || '';
      stock.color = stock.color || sale?.color || '';
      stock.size = stock.size || sale?.size || '';
      stock.thickness = stock.thickness || sale?.thickness || '';
      if (sale?.unit) stock.unit = sale.unit;
      await stock.save();
      if (qty > 0) break;
    }
    if (qty < 0 && remaining > 0) {
      const stock = candidates[0];
      stock.quantity = (+(stock.quantity) || 0) - remaining;
      await stock.save();
    }
    return candidates[0];
  } else {
    const stock = await Stock.create({
      name: stockName, category, itemId: sale?.itemId || '',
      shape: sale?.shape || '', color: sale?.color || '', size: sale?.size || '', thickness: sale?.thickness || '',
      quantity: qty, unit: sale?.unit || 'sqft', minStock: 0, price: +(sale?.price || 0) || 0
    });
    return stock;
  }
}

async function syncWorkerTotals(workerName) {
  const worker = await Worker.findOne({ name: workerName });
  if (!worker) return;

  // 1. Production entries (quantity and earnings)
  const prodEntries = await ProductionSiteEntry.find({ workerName });
  const totalProdQty = prodEntries.reduce((sum, e) => sum + (+(e.producedQty) || 0), 0);
  const totalProdEarnings = prodEntries.reduce((sum, e) => sum + (+(e.totalAmount) || 0), 0);
  const totalProdPaid = prodEntries.reduce((sum, e) => sum + (+(e.paymentGiven) || 0), 0);

  // 2. Site work daily reports (area and earnings)
  const dailyReports = await DailyReport.find({ "workerEntries.workerName": workerName });
  let totalSiteArea = 0;
  let totalSiteEarnings = 0;
  let totalSitePaid = 0;
  dailyReports.forEach(r => {
    (r.workerEntries || []).forEach(we => {
      if (we.workerName === workerName) {
        const normalized = normalizeWorkerEntry(we);
        totalSiteArea += normalized.workArea;
        totalSiteEarnings += normalized.amountEarned;
        totalSitePaid += normalized.paymentGiven;
      }
    });
  });

  // Manual ledger payments remain separate; production/site entry payments come from their source entries.
  const payments = await WorkerPayment.find({ workerName, source: { $nin: ['production', 'daily-report', 'supervisor_report'] } });
  const totalManualPaid = payments.reduce((sum, p) => sum + (+(p.amount) || 0), 0);
  const totalPaid = totalProdPaid + totalSitePaid + totalManualPaid;

  // Update cumulative totals
  worker.totalProduction = totalProdQty + totalSiteArea;
  worker.totalEarnings = totalProdEarnings + totalSiteEarnings;
  worker.totalPaid = totalPaid;
  worker.totalPending = Math.max(0, worker.totalEarnings - worker.totalPaid);

  await worker.save();
}

async function updateWorkerEarnings(workerName, qty, amount) {
  await syncWorkerTotals(workerName);
  return await Worker.findOne({ name: workerName });
}

async function recordWorkerPayment(workerName, amount, date, source, addedBy, note) {
  const payment = await WorkerPayment.create({ workerName, amount, date, source: source || 'manual', addedBy, note });
  await syncWorkerTotals(workerName);
  return payment;
}

function applyDateFilter(filter, dateFilter, field = 'date') {
  if (dateFilter.date) filter[field] = dateFilter.date;
  if (dateFilter.fromDate || dateFilter.toDate) {
    filter[field] = {};
    if (dateFilter.fromDate) filter[field].$gte = dateFilter.fromDate;
    if (dateFilter.toDate) filter[field].$lte = dateFilter.toDate;
  }
}

async function buildProductionWorkerReport(workerName, filters = {}) {
  const worker = await Worker.findOne({ name: workerName });
  const prodFilter = { workerName, producedQty: { $gt: 0 } };
  applyDateFilter(prodFilter, filters);
  if (filters.item) prodFilter.itemName = { $regex: filters.item, $options: 'i' };
  if (filters.color) prodFilter.color = { $regex: filters.color, $options: 'i' };

  const productions = await ProductionSiteEntry.find(prodFilter).sort({ date: -1, createdAt: -1 });
  const itemMap = {};
  productions.forEach(p => {
    const key = p.itemName || 'Other';
    if (!itemMap[key]) itemMap[key] = { item: key, quantity: 0, unit: p.unit || p.unitType || '' };
    itemMap[key].quantity += +(p.producedQty) || 0;
    if (p.unit) itemMap[key].unit = p.unit;
  });

  const totalQuantity = productions.reduce((a, p) => a + (+(p.producedQty) || 0), 0);
  const totalEarnings = productions.reduce((a, p) => a + (+(p.totalAmount) || 0), 0);
  const totalPaid = productions.reduce((a, p) => a + (+(p.paymentGiven) || 0), 0);

  return {
    type: 'production',
    worker: {
      name: workerName,
      role: worker?.role || '',
      phone: worker?.phone || '',
      totalQuantity,
      totalEarnings,
      totalPaid,
      totalPending: Math.max(0, totalEarnings - totalPaid),
    },
    itemSummary: Object.values(itemMap),
    history: productions.map(p => ({
      _id: p._id, date: p.date, item: p.itemName, color: p.color || '',
      qty: p.producedQty, unit: p.unit || p.unitType || '',
      rate: p.productionRate, amount: p.totalAmount, paid: +(p.paymentGiven) || 0,
      pending: Math.max(0, (+(p.totalAmount) || 0) - (+(p.paymentGiven) || 0)),
    })),
    productions,
  };
}

async function buildSiteWorkerReport(workerName, filters = {}) {
  const worker = await Worker.findOne({ name: workerName });
  const reportFilter = {};
  applyDateFilter(reportFilter, filters);
  if (filters.viewerRole === 'supervisor' && filters.viewerName) {
    const supervisorSites = await SiteWork.find({ addedBy: filters.viewerName }).select('customerName _id').lean();
    const siteNames = supervisorSites.map(s => s.customerName).filter(Boolean);
    const siteIds = supervisorSites.map(s => String(s._id));
    reportFilter.$or = [
      { addedBy: filters.viewerName },
      ...(siteNames.length ? [{ siteName: { $in: siteNames } }] : []),
      ...(siteIds.length ? [{ siteId: { $in: siteIds } }] : [])
    ];
  }
  const reports = await DailyReport.find(reportFilter).sort({ date: -1 });

  const history = [];
  const siteMap = {};

  reports.forEach(r => {
    if (filters.site && !(r.siteName || '').toLowerCase().includes(filters.site.toLowerCase())) return;

    (r.workerEntries || []).forEach(we => {
      if (we.workerName !== workerName) return;
      if (filters.item && !(we.workCategory || '').toLowerCase().includes(filters.item.toLowerCase())) return;

      const normalized = normalizeWorkerEntry(we);
      const earned = normalized.amountEarned;
      const paid = normalized.paymentGiven;
      const row = {
        date: r.date, workerName, siteName: r.siteName, dutyArea: we.dutyArea || '',
        workDone: we.workDone || '', workCategory: we.workCategory || '',
        workArea: normalized.workArea, unit: we.unit || '', rate: normalized.rate,
        amountEarned: earned, paymentGiven: paid,
        dailyPending: normalized.pending, balance: normalized.pending, paymentMode: we.paymentMode || '',
        remarks: we.remarks || '', attendance: we.attendance,
      };
      history.push(row);

      const sk = r.siteName || 'Unknown';
      if (!siteMap[sk]) {
        siteMap[sk] = {
          siteName: sk, categories: new Set(), dutyAreas: new Set(),
          workDone: [], totalArea: 0, totalEarned: 0, totalPaid: 0,
          unit: we.unit || 'Sqft', rate: normalized.rate, entries: []
        };
      }
      if (we.workCategory) siteMap[sk].categories.add(we.workCategory);
      if (we.dutyArea) siteMap[sk].dutyAreas.add(we.dutyArea);
      if (we.workDone) siteMap[sk].workDone.push(we.workDone);
      siteMap[sk].totalArea += normalized.workArea;
      siteMap[sk].totalEarned += earned;
      siteMap[sk].totalPaid += paid;
      siteMap[sk].entries.push(row);
    });

    (r.payments || []).filter(p => false && p.type === 'Worker Payment' && p.workerName === workerName).forEach(p => {
      const paid = +(p.amount || 0);
      const row = {
        date: r.date, siteName: r.siteName, dutyArea: '—', workDone: 'Additional Payment',
        workCategory: 'Payment', workArea: 0, unit: '—', rate: 0,
        amountEarned: 0, paymentGiven: paid, balance: 0, isExtraPayment: true,
        paymentMode: p.mode || 'Cash', remarks: p.remarks || '',
      };
      history.push(row);
      const sk = r.siteName || 'Unknown';
      if (!siteMap[sk]) {
        siteMap[sk] = {
          siteName: sk, categories: new Set(), dutyAreas: new Set(),
          workDone: [], totalArea: 0, totalEarned: 0, totalPaid: 0,
          unit: 'Sqft', rate: 0, entries: []
        };
      }
      siteMap[sk].totalPaid += paid;
      siteMap[sk].entries.push(row);
    });
  });

  history.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const workRows = history.filter(h => !h.isExtraPayment);
  const totalSites = new Set(workRows.map(h => h.siteName)).size;
  const totalEarnings = workRows.reduce((a, h) => a + h.amountEarned, 0);
  const totalPaid = history.reduce((a, h) => a + h.paymentGiven, 0);
  const totalAreaCompleted = workRows.reduce((a, h) => a + (+(h.workArea) || 0), 0);

  const sites = Object.values(siteMap).map(s => ({
    siteName: s.siteName,
    workCategory: [...s.categories].join(', ') || '—',
    dutyArea: [...s.dutyAreas].join(', ') || (s.entries[0]?.dutyArea || '—'),
    workCompleted: [...new Set(s.workDone)].join(', ') || '—',
    totalArea: s.totalArea,
    unit: s.unit,
    rate: s.rate,
    totalEarned: s.totalEarned,
    totalPaid: s.totalPaid,
    pending: Math.max(0, s.totalEarned - s.totalPaid),
    entries: s.entries,
  }));

  return {
    type: 'site',
    worker: {
      name: workerName,
      role: worker?.role || '',
      phone: worker?.phone || '',
      totalSites,
      totalAreaCompleted,
      totalEarnings,
      totalPaid,
      totalPending: Math.max(0, totalEarnings - totalPaid),
    },
    sites,
    history,
  };
}

async function buildOverallWorkerAccount(workerName, filters = {}) {
  const production = await buildProductionWorkerReport(workerName, filters);
  const site = await buildSiteWorkerReport(workerName, filters);
  return {
    type: 'overall',
    worker: { name: workerName },
    production: production.worker,
    site: site.worker,
    grandTotal: {
      totalEarnings: production.worker.totalEarnings + site.worker.totalEarnings,
      totalPaid: production.worker.totalPaid + site.worker.totalPaid,
      totalPending: production.worker.totalPending + site.worker.totalPending,
    },
  };
}

async function buildWorkerLedger(workerName, dateFilter = {}) {
  return buildProductionWorkerReport(workerName, dateFilter);
}

app.get('/api/workerpayments', async(req,res)=>res.json(await WorkerPayment.find().sort({date:-1})));
app.post('/api/workerpayments', async(req,res)=>{
  try {
    const { workerName, amount, date, note, addedBy, source } = req.body;
    if (!workerName || !amount) return res.status(400).json({ message: 'Worker name and amount required' });
    const payment = await recordWorkerPayment(workerName, +(amount), date || new Date().toISOString().split('T')[0], source || 'worker-payment', addedBy, note);
    res.json(payment);
  } catch(e) { res.status(400).json({ message: e.message }); }
});

app.get('/api/workers/ledger', async(req,res)=>{
  try {
    const { name, fromDate, toDate } = req.query;
    if (!name) return res.status(400).json({ message: 'Worker name required' });
    res.json(await buildProductionWorkerReport(name, { fromDate, toDate }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/workers/reports/production', async(req,res)=>{
  try {
    const { name, fromDate, toDate, date, item, color } = req.query;
    if (!name) return res.status(400).json({ message: 'Worker name required' });
    res.json(await buildProductionWorkerReport(name, { fromDate, toDate, date, item, color }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/workers/reports/site', async(req,res)=>{
  try {
    const { name, fromDate, toDate, date, site, item, role, userName } = req.query;
    if (!name) return res.status(400).json({ message: 'Worker name required' });
    res.json(await buildSiteWorkerReport(name, { fromDate, toDate, date, site, item, viewerRole: role, viewerName: userName }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/workers/reports/overall', async(req,res)=>{
  try {
    const { name, fromDate, toDate, date } = req.query;
    if (!name) return res.status(400).json({ message: 'Worker name required' });
    res.json(await buildOverallWorkerAccount(name, { fromDate, toDate, date }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/workers/reports/production-list', async(req,res)=>{
  try {
    const workers = await Worker.find().sort({ name: 1 });
    const { fromDate, toDate, date } = req.query;
    const list = await Promise.all(workers.map(async w => {
      const r = await buildProductionWorkerReport(w.name, { fromDate, toDate, date });
      return { name: w.name, ...r.worker };
    }));
    res.json(list.filter(w => w.totalEarnings > 0 || w.totalPaid > 0));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/workers/reports/site-list', async(req,res)=>{
  try {
    const workers = await Worker.find().sort({ name: 1 });
    const { fromDate, toDate, date, site, item, role, userName } = req.query;
    const list = await Promise.all(workers.map(async w => {
      const r = await buildSiteWorkerReport(w.name, { fromDate, toDate, date, site, item, viewerRole: role, viewerName: userName });
      return { name: w.name, ...r.worker };
    }));
    res.json(list.filter(w => w.totalEarnings > 0 || w.totalPaid > 0));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/purchases', async(req,res)=>{
  try {
    const { mobile, supplier, date, fromDate, toDate } = req.query;
    const filter = {};
    if (mobile) {
      const m = normalizeMobile(mobile);
      filter.$or = [{ supplierMobile: m }, { supplierPhone: m }];
    }
    if (supplier) filter.supplierName = { $regex: supplier, $options: 'i' };
    if (date) filter.date = date;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }
    res.json(await Purchase.find(filter).sort({ createdAt: -1 }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});
app.post('/api/purchases', async(req,res)=>{
  try {
    if (!req.body.supplierName) return res.status(400).json({ message: 'Supplier name is required' });
    const mobile = normalizeMobile(req.body.supplierMobile || req.body.supplierPhone);
    const total = +(req.body.totalAmount) || 0;
    const amountPaid = +(req.body.amountPaid) || 0;
    const amountPending = Math.max(0, total - amountPaid);
    const purchase = await Purchase.create({
      ...req.body,
      supplierMobile: mobile,
      supplierPhone: mobile || req.body.supplierPhone,
      totalAmount: total,
      amountPaid,
      amountPending,
    });
    await upsertSupplierFromPurchase(purchase, req.body.saveToSupplierMaster !== false);
    res.json(purchase);
  } catch(e) { res.status(400).json({ message: e.message }); }
});

const masterModels = {interlock:MasterInterlock,materials:MasterMaterial,labor:MasterLabor,extrawork:MasterExtraWork};

function siteCostOf(site) {
  return +(site?.totalCost || site?.totalAmount || 0);
}

function siteWorkPaymentsOf(site) {
  const payments = Array.isArray(site?.payments) ? site.payments : [];
  return payments.reduce((sum, p) => sum + (+(p.amount) || 0), 0);
}

async function getDailySitePayments(site) {
  if (!site) return 0;
  const reports = await DailyReport.find({
    $or: [{ siteName: site.customerName }, { siteId: String(site._id) }]
  }).lean();
  return reports.reduce((sum, report) => sum + (report.payments || []).reduce((inner, p) => {
    const type = paymentKind(p.type);
    return inner + ((type === 'site payment received' || type === 'client payment received') ? (+(p.amount) || 0) : 0);
  }, 0), 0);
}

async function getLegacySiteWorkPayment(site, dailySitePayments = null) {
  if (!site || (Array.isArray(site.payments) && site.payments.length > 0)) return 0;
  const daily = dailySitePayments === null ? await getDailySitePayments(site) : dailySitePayments;
  const storedReceived = +(site.totalReceived ?? site.paidAmount ?? 0) || 0;
  return Math.max(0, storedReceived - daily);
}

async function recalcSiteFinancials(siteOrId) {
  const site = typeof siteOrId === 'string' ? await SiteWork.findById(siteOrId) : siteOrId;
  if (!site) return null;
  const dailySitePayments = await getDailySitePayments(site);
  const totalReceived = siteWorkPaymentsOf(site) + await getLegacySiteWorkPayment(site, dailySitePayments) + dailySitePayments;
  const pendingAmount = Math.max(0, siteCostOf(site) - totalReceived);
  const paymentStatus = pendingAmount === 0 && siteCostOf(site) > 0 ? 'paid' : totalReceived > 0 ? 'partial' : 'pending';
  site.totalReceived = totalReceived;
  site.paidAmount = totalReceived;
  site.pendingAmount = String(pendingAmount);
  site.paymentStatus = paymentStatus;
  await site.save();
  return site;
}

function currentPlanningWindow() {
  const now = new Date();
  const firstPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${firstPrevious.getFullYear()}-${String(firstPrevious.getMonth() + 1).padStart(2, '0')}-01`;
}
['interlock','materials','labor','extrawork'].forEach(type=>{
  const Model = masterModels[type];
  app.get(`/api/masterdata/${type}`, async(req,res)=>res.json(await Model.find()));
  app.post(`/api/masterdata/${type}`, async(req,res)=>res.json(await Model.create(req.body)));
  app.put(`/api/masterdata/${type}/:id`, async(req,res)=>res.json(await Model.findByIdAndUpdate(req.params.id,req.body,{new:true})));
  app.delete(`/api/masterdata/${type}/:id`, async(req,res)=>{await Model.findByIdAndDelete(req.params.id);res.json({ok:true});});
});

app.get("/api/suppliers", async(req,res)=>res.json(await Supplier.find().sort({name:1})));
app.post("/api/suppliers", async(req,res)=>{
  try {
    const data = { ...req.body };
    if (data.mobile || data.phone) {
      const m = normalizeMobile(data.mobile || data.phone);
      data.mobile = m; data.phone = m;
    }
    if (data.address && !data.location) data.location = data.address;
    res.json(await Supplier.create(data));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.put("/api/suppliers/:id", async(req,res)=>{
  const data = { ...req.body };
  if (data.mobile || data.phone) {
    const m = normalizeMobile(data.mobile || data.phone);
    data.mobile = m; data.phone = m;
  }
  if (data.address) data.location = data.address;
  res.json(await Supplier.findByIdAndUpdate(req.params.id, data, { new: true }));
});
app.delete("/api/suppliers/:id", async(req,res)=>{await Supplier.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/suppliers/ledger', async(req,res)=>{
  try {
    const { mobile, name, fromDate, toDate } = req.query;
    const ledger = await buildSupplierLedger({ mobile, name, dateFilter: { fromDate, toDate } });
    if (!ledger) return res.json({ supplier: null, purchases: [], materialSummary: [] });
    res.json(ledger);
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/suppliers/reports', async(req,res)=>{
  try {
    const { type } = req.query;
    const suppliers = await Supplier.find().sort({ name: 1 });
    const allPurchases = await Purchase.find();
    const materialMap = {};
    allPurchases.forEach(p => {
      const key = p.itemName || 'Other';
      if (!materialMap[key]) materialMap[key] = { material: key, quantity: 0, unit: p.unit || '', amount: 0 };
      materialMap[key].quantity += +(p.quantity) || 0;
      materialMap[key].amount += +(p.totalAmount) || 0;
    });
    let list = suppliers.map(s => ({
      _id: s._id, name: s.name, mobile: s.mobile || s.phone,
      totalPurchaseAmount: s.totalPurchaseAmount, totalPaid: s.totalPaid, totalPending: s.totalPending,
    }));
    if (type === 'pending') list = list.filter(s => (+(s.totalPending) || 0) > 0);
    if (type === 'paid') list = list.filter(s => (+(s.totalPending) || 0) <= 0 && (+(s.totalPurchaseAmount) || 0) > 0);
    res.json({ suppliers: list, materialWise: Object.values(materialMap) });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get("/api/productionsite", async(req,res)=>{
  try {
    const { worker, item, color, date, fromDate, toDate } = req.query;
    const filter = {};
    if (worker) filter.workerName = { $regex: worker, $options: 'i' };
    if (item) filter.itemName = { $regex: item, $options: 'i' };
    if (color) filter.color = { $regex: color, $options: 'i' };
    if (date) filter.date = date;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }
    res.json(await ProductionSiteEntry.find(filter).sort({ createdAt: -1 }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.post("/api/productionsite", async(req,res)=>{
  try {
    const body = req.body;
    if (body.workerName && body.itemName && body.producedQty != null) {
      const worker = await Worker.findOne({ name: body.workerName }).lean();
      if (!worker || normalizeWorkerType(worker) !== 'Production Worker' || !isWorkerActive(worker)) {
        return res.status(400).json({ message: 'Select an active production worker' });
      }
      const producedQty = +(body.producedQty) || 0;
      const productionRate = +(body.productionRate) || 0;
      if (!producedQty) return res.status(400).json({ message: 'Produced quantity is required' });
      if (!productionRate) return res.status(400).json({ message: 'Rate per unit must be entered manually' });
      const totalAmount = producedQty * productionRate;
      const paymentGiven = +(body.paymentGiven) || 0;
      const amountPending = Math.max(0, totalAmount - paymentGiven);
      const entry = await ProductionSiteEntry.create({
        ...body, producedQty, productionRate, totalAmount, paymentGiven, amountPending,
      });
      await updateStockFromProduction({ ...body, producedQty });
      await syncWorkerTotals(body.workerName);
      if (paymentGiven > 0) {
        await recordWorkerPayment(body.workerName, paymentGiven, body.date, 'production', body.addedBy, `Production: ${body.itemName}`);
      }
      return res.json(entry);
    }
    res.json(await ProductionSiteEntry.create(body));
  } catch(e) { res.status(400).json({ message: e.message }); }
});

app.put("/api/productionsite/:id", async(req,res)=>res.json(await ProductionSiteEntry.findByIdAndUpdate(req.params.id,req.body,{new:true})));

app.get('/api/productionsite/reports', async(req,res)=>{
  try {
    const { type, fromDate, toDate, pending } = req.query;
    const filter = { producedQty: { $exists: true, $gt: 0 } };
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }
    const entries = await ProductionSiteEntry.find(filter).sort({ createdAt: -1 });
    const workers = await Worker.find().sort({ name: 1 });

    const workerMap = {};
    entries.forEach(e => {
      if (!workerMap[e.workerName]) workerMap[e.workerName] = { worker: e.workerName, quantity: 0, earnings: 0, paid: 0 };
      workerMap[e.workerName].quantity += +(e.producedQty) || 0;
      workerMap[e.workerName].earnings += +(e.totalAmount) || 0;
      workerMap[e.workerName].paid += +(e.paymentGiven) || 0;
    });

    const itemMap = {};
    const colorMap = {};
    entries.forEach(e => {
      const ik = e.itemName || 'Other';
      if (!itemMap[ik]) itemMap[ik] = { item: ik, quantity: 0, unit: e.unit || '', amount: 0 };
      itemMap[ik].quantity += +(e.producedQty) || 0;
      itemMap[ik].amount += +(e.totalAmount) || 0;
      const ck = e.color || 'Other';
      if (!colorMap[ck]) colorMap[ck] = { color: ck, quantity: 0, amount: 0 };
      colorMap[ck].quantity += +(e.producedQty) || 0;
      colorMap[ck].amount += +(e.totalAmount) || 0;
    });

    let pendingWorkers = workers.filter(w => (+(w.totalPending) || 0) > 0).map(w => ({
      name: w.name, totalEarnings: w.totalEarnings, totalPaid: w.totalPaid, totalPending: w.totalPending,
    }));
    if (pending === 'true') return res.json({ pendingWorkers, entries: [] });

    res.json({
      totalEntries: entries.length,
      totalQuantity: entries.reduce((a, e) => a + (+(e.producedQty) || 0), 0),
      totalAmount: entries.reduce((a, e) => a + (+(e.totalAmount) || 0), 0),
      workerWise: Object.values(workerMap),
      itemWise: Object.values(itemMap),
      colorWise: Object.values(colorMap),
      pendingWorkers,
      entries: type === 'detail' ? entries : undefined,
    });
  } catch(e) { res.status(500).json({ message: e.message }); }
});


// Device Management
const DeviceSchema = new mongoose.Schema({
  deviceId:String, username:String, name:String, role:String,
  deviceName:String, browser:String, loginTime:String, status:{type:String,default:"pending"}
},{timestamps:true});
const Device = mongoose.model("Device", DeviceSchema);

app.get("/api/devices", async(req,res)=>res.json(await Device.find().sort({createdAt:-1})));
app.post("/api/devices/check", async(req,res)=>{
  const {deviceId,username} = req.body;
  let device = await Device.findOne({deviceId,username});
  if (!device) {
    device = await Device.create({...req.body, status:"pending"});
    return res.json({status:"pending"});
  }
  res.json({status:device.status});
});
app.put("/api/devices/:id", async(req,res)=>res.json(await Device.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete("/api/devices/:id", async(req,res)=>{await Device.findByIdAndDelete(req.params.id);res.json({ok:true});});

function cashFlowDateFilter(fromDate, toDate) {
  if (!fromDate && !toDate) return undefined;
  const date = {};
  if (fromDate) date.$gte = fromDate;
  if (toDate) date.$lte = toDate;
  return date;
}

function cashFlowRow(map, date, person, personRole) {
  const key = `${date}|${person}|${personRole}`;
  if (!map[key]) {
    map[key] = {
      date, person, personRole,
      received: 0, salesAmount: 0, customerPayments: 0,
      workerPayments: 0, vehicleCharges: 0, materialPayments: 0,
      equipmentPayments: 0, purchasePayments: 0, otherExpenses: 0,
      totalExpenses: 0, netBalance: 0,
      receivedDetails: [], spentDetails: [], salesDetails: [], purchaseDetails: [],
    };
  }
  return map[key];
}

function paymentKind(type) {
  return String(type || '').trim().toLowerCase();
}

app.get('/api/cashflow', async(req,res)=>{
  try {
    const { role, name, personRole, person, fromDate, toDate } = req.query;
    if (!['admin', 'supervisor', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }

    const date = cashFlowDateFilter(fromDate, toDate);
    const people = role === 'admin'
      ? await User.find({ role: { $in: ['supervisor', 'user'] } }, 'name role').lean()
      : [];
    const namesFor = targetRole => people
      .filter(user => user.role === targetRole && (!person || user.name === person))
      .map(user => user.name);
    const ownerFilter = role === 'admin' ? {} : { addedBy: name };
    const rows = {};

    if (role === 'admin' ? personRole !== 'user' : role === 'supervisor') {
      const reportFilter = role === 'admin' ? { addedBy: { $in: namesFor('supervisor') } } : { ...ownerFilter };
      const siteFilter = role === 'admin' ? { addedBy: { $in: namesFor('supervisor') } } : { ...ownerFilter };
      if (date) reportFilter.date = date;
      const reports = await DailyReport.find(reportFilter).lean();
      const sites = await SiteWork.find(siteFilter).lean();
      for (const site of sites) {
        const owner = site.addedBy || 'Unknown';
        (site.payments || []).forEach(payment => {
          if (date && ((fromDate && payment.date < fromDate) || (toDate && payment.date > toDate))) return;
          const amount = +(payment.amount) || 0;
          const row = cashFlowRow(rows, payment.date || site.startDate || '', owner, 'supervisor');
          row.received += amount;
          row.receivedDetails.push({ date: payment.date || site.startDate || '', site: site.customerName, source: 'Site Work', amount, paymentMode: payment.mode || site.paymentMode || '' });
        });
        const legacyAmount = await getLegacySiteWorkPayment(site);
        if (legacyAmount > 0) {
          const legacyDate = site.startDate || site.createdAt?.toISOString?.().slice(0, 10) || '';
          if (!date || !((fromDate && legacyDate < fromDate) || (toDate && legacyDate > toDate))) {
            const row = cashFlowRow(rows, legacyDate, owner, 'supervisor');
            row.received += legacyAmount;
            row.receivedDetails.push({ date: legacyDate, site: site.customerName, source: 'Initial Site Work', amount: legacyAmount, paymentMode: site.paymentMode || '' });
          }
        }
      }
      reports.forEach(report => {
        const owner = report.addedBy || 'Unknown';
        const row = cashFlowRow(rows, report.date || '', owner, 'supervisor');
        (report.workerEntries || []).forEach(worker => {
          const amount = +(worker.paymentGiven) || 0;
          row.workerPayments += amount;
          if (amount > 0) row.spentDetails.push({ date: report.date, type: 'Worker Payment', details: `${worker.workerName || 'Worker'} ${worker.workCategory || ''}`.trim(), amount });
        });
        (report.payments || []).forEach(payment => {
          const amount = +(payment.amount) || 0;
          const kind = paymentKind(payment.type);
          if (kind === 'site payment received' || kind === 'client payment received') {
            row.received += amount;
            row.receivedDetails.push({ date: report.date, site: report.siteName, source: 'Supervisor Daily Report', amount, paymentMode: payment.mode || '' });
          }
          else if (kind.includes('vehicle')) { row.vehicleCharges += amount; row.spentDetails.push({ date: report.date, type: 'Vehicle Charge', details: payment.expenseName || payment.remarks || payment.paidTo || 'Vehicle Charge', amount }); }
          else if (kind === 'material payment') { row.materialPayments += amount; row.spentDetails.push({ date: report.date, type: 'Material Payment', details: payment.materialName || payment.supplierName || payment.remarks || 'Material Payment', amount }); }
          else if (kind === 'equipment payment') { row.equipmentPayments += amount; row.spentDetails.push({ date: report.date, type: 'Equipment Payment', details: payment.equipmentName || payment.remarks || 'Equipment Payment', amount }); }
          else if (kind === 'other expense') { row.otherExpenses += amount; row.spentDetails.push({ date: report.date, type: 'Other Expense', details: payment.expenseName || payment.remarks || 'Other Expense', amount }); }
        });
      });
    }

    if (role === 'admin' ? personRole !== 'supervisor' : role === 'user') {
      const userOwnerFilter = role === 'admin' ? { addedBy: { $in: namesFor('user') } } : { ...ownerFilter };
      const salesFilter = { ...userOwnerFilter };
      const purchaseFilter = { ...userOwnerFilter };
      const expenseFilter = { ...userOwnerFilter };
      if (date) {
        salesFilter.date = date;
        purchaseFilter.date = date;
        expenseFilter.date = date;
      }
      const [sales, purchases, expenseReports] = await Promise.all([
        Sales.find(salesFilter).lean(),
        Purchase.find(purchaseFilter).lean(),
        DailyReport.find(expenseFilter).lean(),
      ]);
      sales.forEach(sale => {
        const owner = sale.addedBy || 'Unknown';
        const row = cashFlowRow(rows, sale.date || '', owner, 'user');
        row.salesAmount += +(sale.total) || 0;
        row.customerPayments += +(sale.amountPaid) || 0;
        row.received += +(sale.amountPaid) || 0;
        row.salesDetails.push({ date: sale.date, customer: sale.customer, item: sale.product || sale.interlockDetails, amountReceived: +(sale.amountPaid) || 0, totalAmount: +(sale.total) || 0 });
      });
      purchases.forEach(purchase => {
        const owner = purchase.addedBy || 'Unknown';
        const row = cashFlowRow(rows, purchase.date || '', owner, 'user');
        row.purchasePayments += +(purchase.amountPaid) || 0;
        row.purchaseDetails.push({ date: purchase.date, supplier: purchase.supplierName, material: purchase.itemName || purchase.itemType, amountPaid: +(purchase.amountPaid) || 0 });
      });
      expenseReports.forEach(report => {
        const owner = report.addedBy || 'Unknown';
        (report.payments || []).forEach(payment => {
          const kind = paymentKind(payment.type);
          if (kind !== 'other expense' && kind !== 'other user transaction') return;
          const row = cashFlowRow(rows, report.date || '', owner, 'user');
          const amount = +(payment.amount) || 0;
          row.otherExpenses += amount;
          row.spentDetails.push({ date: report.date, type: 'Other Expense', details: payment.remarks || payment.paidTo || 'Other Expense', amount });
        });
      });
    }

    const history = Object.values(rows).map(row => {
      const supervisorExpenses = row.workerPayments + row.vehicleCharges + row.materialPayments + row.equipmentPayments + row.otherExpenses;
      const userExpenses = row.purchasePayments + row.otherExpenses;
      row.totalExpenses = row.personRole === 'supervisor' ? supervisorExpenses : userExpenses;
      row.netBalance = row.received - row.totalExpenses;
      return row;
    }).sort((a,b) => b.date.localeCompare(a.date) || a.person.localeCompare(b.person));

    const total = history.reduce((sum, row) => {
      Object.keys(sum).forEach(key => { sum[key] += +(row[key]) || 0; });
      return sum;
    }, {
      received: 0, salesAmount: 0, customerPayments: 0,
      workerPayments: 0, vehicleCharges: 0, materialPayments: 0,
      equipmentPayments: 0, purchasePayments: 0, otherExpenses: 0,
      totalExpenses: 0, netBalance: 0,
    });

    res.json({ history, total });
  } catch(e) {
    res.status(500).json({ message: e.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, async()=>{
  console.log(`🚀 Server running on port ${PORT}`);
  await seedData();
});
