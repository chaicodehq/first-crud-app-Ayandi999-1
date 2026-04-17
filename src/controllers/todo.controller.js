import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const data = req.body;
    const createdData = await Todo.create(data);
    return res.status(201).json(createdData);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.completed === 'true') query.completed = true;
    if (req.query.completed === 'false') query.completed = false;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.search) query.title = { $regex: req.query.search, $options: 'i' };

    let [fetchedData, total] = await Promise.all([Todo.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip), Todo.countDocuments(query)]);

    return res.json({ data: fetchedData, meta: { total, page, limit, pages: Math.ceil(total / limit) } })

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const task = await Todo.findById(req.params.id);
    if (!task) return res.status(404).json({ error: { message: `Not Found` } });
    return res.json(task);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: { message: `Not found` } });
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const data = await Todo.findById(req.params.id);
    if (!data) return res.status(404).json({ error: { message: `Not found` } });
    data.completed = data.completed ? false : true;
    await data.save();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: { message: `Not found` } });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
