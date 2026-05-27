const express = require('express');
const router = express.Router();

const { supabase } = require('../db/supabase');

// GET /api/tasks -> fetch all tasks ordered by created_at desc
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
});

// POST /api/tasks -> create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body ?? {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'title is required and must be a string' });
    }

    const insertPayload = {
      title: title.trim(),
      description: description ?? null,
      status: status ?? 'Todo',
      due_date: due_date ?? null,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
});

// PUT /api/tasks/:id -> update a task by id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body ?? {};

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    // If title is provided, validate it
    if (title !== undefined) {
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'title must be a non-empty string when provided' });
      }
    }

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title.trim();
    if (description !== undefined) updatePayload.description = description ?? null;
    if (status !== undefined) updatePayload.status = status;
    if (due_date !== undefined) updatePayload.due_date = due_date ?? null;

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      // Supabase returns an error for not found vs empty results depending on version/config.
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
});

// DELETE /api/tasks/:id -> delete a task by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    // Fetch first to return a meaningful not-found response
    const { data: existing, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    return res.status(200).json({ data: existing });
  } catch (err) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
});

module.exports = router;

