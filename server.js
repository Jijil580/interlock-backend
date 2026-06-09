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
const StockSchema = new mongoose.Schema({ name:String, unit:String, quantity:Number, minStock:Number, price:Number, company:String }, {timestamps:true});
const RawMaterialSchema = new mongoose.Schema({ name:String, material:String, supplier:String, unit:String, quantity:Number, qty:Number, price:Number, costPerUnit:Number, lastPurchase:String, company:String }, {timestamps:true});
const ProductionSchema = new mongoose.Schema({ date:String, product:String, shift:String, target:Number, produced:Number, machine:String, supervisor:String, status:{type:String,default:'pending'}, notes:String, note:String, company:String }, {timestamps:true});
const SalesSchema = new mongoose.Schema({ date:String, customer:String, mobileNumber:String, address:String, product:String, interlockDetails:String, quantity:Number, unit:String, price:Number, unitPrice:Number, discount:{type:Number,default:0}, total:Number, amountPaid:{type:Number,default:0}, amountPending:{type:Number,default:0}, paymentMode:String, invoiceNumber:String, status:{type:String,default:'pending'}, addedBy:String, company:String }, {timestamps:true});
const CustomerSchema = new mongoose.Schema({ mobile:{type:String,unique:true}, name:String, address:String, totalPurchases:{type:Number,default:0}, totalSalesAmount:{type:Number,default:0}, totalDiscount:{type:Number,default:0}, totalPaid:{type:Number,default:0}, totalPending:{type:Number,default:0}, company:String }, {timestamps:true});
const SiteWorkSchema = new mongoose.Schema({ customerName:String, phone:String, siteLocation:String, location:String, interlockType:String, interlockColor:String, selectedWorkers:[String], startDate:String, endDate:String, status:{type:String,default:'running'}, workUnit:String, workSize:String, ratePerUnit:String, baseWorkCost:String, extraWork:Array, extraMaterials:Array, materialCost:String, laborCost:String, totalCost:String, advancePaid:String, pendingAmount:String, paymentStatus:{type:String,default:'pending'}, paymentMode:String, note:String, addedBy:String, workStatus:String, totalAmount:Number, paidAmount:Number, company:String }, {timestamps:true});
const WorkerReportSchema = new mongoose.Schema({ siteName:String, phoneNo:String, startingDate:String, workerName:String, totalArea:String, workingCost:String, extraWork:String, extraMaterial:String, totalWorkingArea:String, totalAmount:String, note:String, paymentMode:String, upiId:String, bankName:String, bankBranch:String, bankAccount:String, amountReceivedBy:String, materialSupply:String, materialType:String, signatures:{supervisor:Boolean,office:Boolean,admin:Boolean}, addedBy:String }, {timestamps:true});
const DailyReportSchema = new mongoose.Schema({ date:String, siteName:String, siteId:String, siteStatus:String, workersCount:String, totalArea:String, completedToday:String, totalCompleted:String, interlockType:String, dayNotes:String, materialsUnloaded:String, materialQty:String, equipment:String, supplierName:String, materialRemarks:String, extraWorkDesc:String, extraWorkQty:String, extraWorkCost:String, extraWorkRemarks:String, payments:Array, totalPayments:Number, complaints:String, actionTaken:String, complaintRemarks:String, addedBy:String, newSite:String, runningSite:String, workersDetail:String, materialSupply:String, dayNote:String, expenses:String, workerPayments:[{workerName:String,amount:Number,date:String,note:String}] }, {timestamps:true});
const WorkPlanSchema = new mongoose.Schema({ date:String, siteName:String, task:String, workers:String, materials:String, note:String, status:{type:String,default:'planned'}, fromDate:String, toDate:String, site:String, plannedWork:String, workersAllocated:String, materialsNeeded:String, estimatedCost:Number, paymentPlan:String, notes:String, addedBy:String }, {timestamps:true});
const WorkerSchema = new mongoose.Schema({ name:String, phone:String, address:String, role:String, workerCategory:String, workLocationType:String, paymentType:String, customPaymentType:String, rateType:String, rateAmount:Number, addedBy:String }, {timestamps:true});
const WorkerPaymentSchema = new mongoose.Schema({ workerName:String, amount:Number, date:String, note:String, addedBy:String, source:String, reportDate:String }, {timestamps:true});
const PurchaseSchema = new mongoose.Schema({ date:String, supplierName:String, supplierPhone:String, supplierAddress:String, itemName:String, itemType:String, quantity:String, unit:String, unitPrice:String, totalAmount:Number, paymentMode:String, vehicleNumber:String, vehicleType:String, driverName:String, driverPhone:String, deliveryAddress:String, note:String, addedBy:String }, {timestamps:true});
const MasterDataSchema = new mongoose.Schema({ name:String, category:String, shape:String, color:String, size:String, thickness:String, pricePerSqft:Number, pricePerSqm:Number, unit:String, price:Number, stock:Number, rate:Number, rateType:String, description:String, notes:String, addedBy:String }, {timestamps:true});




const User = mongoose.model('User', UserSchema);
const Stock = mongoose.model('Stock', StockSchema);
const RawMaterial = mongoose.model('RawMaterial', RawMaterialSchema);
const Production = mongoose.model('Production', ProductionSchema);
const Sales = mongoose.model('Sales', SalesSchema);
const Customer = mongoose.model('Customer', CustomerSchema);

function normalizeMobile(m) {
  return String(m || '').replace(/\D/g, '').slice(-10);
}

async function upsertCustomerFromSale(sale) {
  const mobile = normalizeMobile(sale.mobileNumber);
  if (!mobile || mobile.length < 10) return null;
  const paid = +(sale.amountPaid) || 0;
  const pending = +(sale.amountPending) || 0;
  const total = +(sale.total) || 0;
  const discount = +(sale.discount) || 0;
  let customer = await Customer.findOne({ mobile });
  if (!customer) {
    customer = await Customer.create({
      mobile,
      name: sale.customer || '',
      address: sale.address || '',
      totalPurchases: 1,
      totalSalesAmount: total,
      totalDiscount: discount,
      totalPaid: paid,
      totalPending: pending,
      company: sale.company || 'default',
    });
  } else {
    if (sale.customer) customer.name = sale.customer;
    if (sale.address) customer.address = sale.address;
    customer.totalPurchases += 1;
    customer.totalSalesAmount += total;
    customer.totalDiscount += discount;
    customer.totalPaid += paid;
    customer.totalPending += pending;
    await customer.save();
  }
  return customer;
}
const SiteWork = mongoose.model('SiteWork', SiteWorkSchema);
const WorkerReport = mongoose.model('WorkerReport', WorkerReportSchema);
const DailyReport = mongoose.model('DailyReport', DailyReportSchema);
const WorkPlan = mongoose.model('WorkPlan', WorkPlanSchema);
const Worker = mongoose.model('Worker', WorkerSchema);
const WorkerPayment = mongoose.model('WorkerPayment', WorkerPaymentSchema);
const Purchase = mongoose.model('Purchase', PurchaseSchema);
const MasterInterlock = mongoose.model('MasterInterlock', MasterDataSchema);
const MasterMaterial = mongoose.model('MasterMaterial', new mongoose.Schema({...MasterDataSchema.obj},{timestamps:true}));
const MasterLabor = mongoose.model('MasterLabor', new mongoose.Schema({...MasterDataSchema.obj},{timestamps:true}));
const MasterExtraWork = mongoose.model('MasterExtraWork', new mongoose.Schema({...MasterDataSchema.obj},{timestamps:true}));

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
app.post('/api/stock', async(req,res)=>res.json(await Stock.create(req.body)));
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
    await upsertCustomerFromSale(sale);
    res.json(sale);
  } catch(e) { res.status(400).json({ message: e.message }); }
});
app.put('/api/sales/:id', async(req,res)=>res.json(await Sales.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete('/api/sales/:id', async(req,res)=>{await Sales.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/customers/mobile/:mobile', async(req,res)=>{
  try {
    const mobile = normalizeMobile(req.params.mobile);
    if (!mobile) return res.status(400).json({ message: 'Invalid mobile number' });
    const customer = await Customer.findOne({ mobile });
    const purchases = await Sales.find({ mobileNumber: mobile }).sort({ createdAt: -1 });
    const summary = customer ? {
      name: customer.name,
      mobile: customer.mobile,
      address: customer.address,
      totalPurchases: customer.totalPurchases,
      totalSalesAmount: customer.totalSalesAmount,
      totalDiscount: customer.totalDiscount,
      totalPaid: customer.totalPaid,
      totalPending: customer.totalPending,
    } : purchases.length ? {
      name: purchases[0].customer || '',
      mobile,
      address: purchases[0].address || '',
      totalPurchases: purchases.length,
      totalSalesAmount: purchases.reduce((a,s)=>a+(+(s.total)||0),0),
      totalDiscount: purchases.reduce((a,s)=>a+(+(s.discount)||0),0),
      totalPaid: purchases.reduce((a,s)=>a+(+(s.amountPaid)||0),0),
      totalPending: purchases.reduce((a,s)=>a+(+(s.amountPending)||0),0),
    } : null;
    res.json({ customer: summary, purchases });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/sitework', async(req,res)=>res.json(await SiteWork.find().sort({createdAt:-1})));
app.post('/api/sitework', async(req,res)=>res.json(await SiteWork.create(req.body)));
app.put('/api/sitework/:id', async(req,res)=>res.json(await SiteWork.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete('/api/sitework/:id', async(req,res)=>{await SiteWork.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/workerreport', async(req,res)=>res.json(await WorkerReport.find().sort({createdAt:-1})));
app.post('/api/workerreport', async(req,res)=>res.json(await WorkerReport.create(req.body)));
app.put('/api/workerreport/:id', async(req,res)=>res.json(await WorkerReport.findByIdAndUpdate(req.params.id,req.body,{new:true})));

app.get('/api/dailyreport', async(req,res)=>res.json(await DailyReport.find().sort({createdAt:-1})));
app.post('/api/dailyreport', async(req,res)=>res.json(await DailyReport.create(req.body)));
app.put('/api/dailyreport/:id', async(req,res)=>res.json(await DailyReport.findByIdAndUpdate(req.params.id,req.body,{new:true})));

app.get('/api/workplan', async(req,res)=>res.json(await WorkPlan.find().sort({createdAt:-1})));
app.post('/api/workplan', async(req,res)=>res.json(await WorkPlan.create(req.body)));
app.put('/api/workplan/:id', async(req,res)=>res.json(await WorkPlan.findByIdAndUpdate(req.params.id,req.body,{new:true})));

app.get('/api/workers', async(req,res)=>res.json(await Worker.find().sort({name:1})));
app.post('/api/workers', async(req,res)=>res.json(await Worker.create(req.body)));
app.put('/api/workers/:id', async(req,res)=>res.json(await Worker.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete('/api/workers/:id', async(req,res)=>{await Worker.findByIdAndDelete(req.params.id);res.json({ok:true});});

app.get('/api/workerpayments', async(req,res)=>res.json(await WorkerPayment.find().sort({date:-1})));
app.post('/api/workerpayments', async(req,res)=>res.json(await WorkerPayment.create(req.body)));

app.get('/api/purchases', async(req,res)=>res.json(await Purchase.find().sort({createdAt:-1})));
app.post('/api/purchases', async(req,res)=>res.json(await Purchase.create(req.body)));

const masterModels = {interlock:MasterInterlock,materials:MasterMaterial,labor:MasterLabor,extrawork:MasterExtraWork};
['interlock','materials','labor','extrawork'].forEach(type=>{
  const Model = masterModels[type];
  app.get(`/api/masterdata/${type}`, async(req,res)=>res.json(await Model.find()));
  app.post(`/api/masterdata/${type}`, async(req,res)=>res.json(await Model.create(req.body)));
  app.put(`/api/masterdata/${type}/:id`, async(req,res)=>res.json(await Model.findByIdAndUpdate(req.params.id,req.body,{new:true})));
  app.delete(`/api/masterdata/${type}/:id`, async(req,res)=>{await Model.findByIdAndDelete(req.params.id);res.json({ok:true});});
});

// Suppliers
const SupplierSchema = new mongoose.Schema({ name:String, location:String, phone:String, materials:[String], customMaterial:String, note:String, addedBy:String }, {timestamps:true});
const Supplier = mongoose.model("Supplier", SupplierSchema);
app.get("/api/suppliers", async(req,res)=>res.json(await Supplier.find().sort({name:1})));
app.post("/api/suppliers", async(req,res)=>res.json(await Supplier.create(req.body)));
app.put("/api/suppliers/:id", async(req,res)=>res.json(await Supplier.findByIdAndUpdate(req.params.id,req.body,{new:true})));
app.delete("/api/suppliers/:id", async(req,res)=>{await Supplier.findByIdAndDelete(req.params.id);res.json({ok:true});});

// Production Site
const ProductionSiteSchema = new mongoose.Schema({ date:String, workType:String, notes:String, attendance:Array, totalCost:Number, addedBy:String }, {timestamps:true});
const ProductionSiteEntry = mongoose.model("ProductionSiteEntry", ProductionSiteSchema);
app.get("/api/productionsite", async(req,res)=>res.json(await ProductionSiteEntry.find().sort({date:-1})));
app.post("/api/productionsite", async(req,res)=>res.json(await ProductionSiteEntry.create(req.body)));
app.put("/api/productionsite/:id", async(req,res)=>res.json(await ProductionSiteEntry.findByIdAndUpdate(req.params.id,req.body,{new:true})));


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


const PORT = process.env.PORT || 5000;
app.listen(PORT, async()=>{
  console.log(`🚀 Server running on port ${PORT}`);
  await seedData();
});
