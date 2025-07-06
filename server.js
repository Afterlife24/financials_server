const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

console.log('Initializing server...');
console.log('Middleware setup complete (CORS and bodyParser)');

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect('mongodb+srv://financials:financials@financials.6f1amos.mongodb.net/?retryWrites=true&w=majority&appName=Financials', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected successfully");
  console.log(`Connected to database: ${mongoose.connection.name}`);
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Schemas
console.log('Defining Mongoose schemas...');
const taskSchema = new mongoose.Schema({
  person: String,
  text: String,
  completed: Boolean,
  createdAt: Date
});

const revenueSchema = new mongoose.Schema({
  amount: Number,
  source: String,
  createdAt: Date
});

const expenseSchema = new mongoose.Schema({
  amount: Number,
  reason: String,
  createdAt: Date
});

console.log('Schemas defined: Task, Revenue, Expense');

// Models
console.log('Creating Mongoose models...');
const Task = mongoose.model('Task', taskSchema);
const Revenue = mongoose.model('Revenue', revenueSchema);
const Expense = mongoose.model('Expense', expenseSchema);
console.log('Models created: Task, Revenue, Expense');

// Routes for Tasks
app.get('/tasks/:person', async (req, res) => {
  console.log(`📋 GET /tasks/${req.params.person} - Fetching tasks for person`);
  try {
    const tasks = await Task.find({ person: req.params.person }).sort({ createdAt: -1 });
    console.log(`✅ Found ${tasks.length} tasks for ${req.params.person}`);
    res.json(tasks);
  } catch (err) {
    console.error(`❌ Error fetching tasks for ${req.params.person}:`, err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  console.log('📝 POST /tasks - Creating new task:', req.body);
  try {
    const task = new Task(req.body);
    await task.save();
    console.log('✅ Task created successfully:', task);
    res.json(task);
  } catch (err) {
    console.error('❌ Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  console.log(`🔄 PUT /tasks/${req.params.id} - Updating task with data:`, req.body);
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      console.log(`⚠️ Task ${req.params.id} not found`);
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('✅ Task updated successfully:', updated);
    res.json(updated);
  } catch (err) {
    console.error(`❌ Error updating task ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  console.log(`🗑️ DELETE /tasks/${req.params.id} - Deleting task`);
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log(`⚠️ Task ${req.params.id} not found`);
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('✅ Task deleted successfully:', deleted);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(`❌ Error deleting task ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Routes for Revenue
app.get('/revenues', async (req, res) => {
  console.log('💰 GET /revenues - Fetching all revenue entries');
  try {
    const revenues = await Revenue.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${revenues.length} revenue entries`);
    res.json(revenues);
  } catch (err) {
    console.error('❌ Error fetching revenues:', err);
    res.status(500).json({ error: 'Failed to fetch revenues' });
  }
});

app.post('/revenues', async (req, res) => {
  console.log('💸 POST /revenues - Creating new revenue entry:', req.body);
  try {
    const revenue = new Revenue(req.body);
    await revenue.save();
    console.log('✅ Revenue created successfully:', revenue);
    res.json(revenue);
  } catch (err) {
    console.error('❌ Error creating revenue:', err);
    res.status(500).json({ error: 'Failed to create revenue' });
  }
});

app.delete('/revenues/:id', async (req, res) => {
  console.log(`🗑️ DELETE /revenues/${req.params.id} - Deleting revenue entry`);
  try {
    const deleted = await Revenue.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log(`⚠️ Revenue entry ${req.params.id} not found`);
      return res.status(404).json({ error: 'Revenue not found' });
    }
    console.log('✅ Revenue deleted successfully:', deleted);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(`❌ Error deleting revenue ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete revenue' });
  }
});

// Routes for Expenses
app.get('/expenses', async (req, res) => {
  console.log('💳 GET /expenses - Fetching all expense entries');
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${expenses.length} expense entries`);
    res.json(expenses);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/expenses', async (req, res) => {
  console.log('🛒 POST /expenses - Creating new expense entry:', req.body);
  try {
    const expense = new Expense(req.body);
    await expense.save();
    console.log('✅ Expense created successfully:', expense);
    res.json(expense);
  } catch (err) {
    console.error('❌ Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  console.log(`🗑️ DELETE /expenses/${req.params.id} - Deleting expense entry`);
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log(`⚠️ Expense entry ${req.params.id} not found`);
      return res.status(404).json({ error: 'Expense not found' });
    }
    console.log('✅ Expense deleted successfully:', deleted);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(`❌ Error deleting expense ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Start server
module.exports = app;