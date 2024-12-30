const express = require('express');
const { body, validationResult } = require('express-validator'); // Validation utilities
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');

const router = express.Router();

// Route 1: Get all the notes from the database : GET /fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id }); // Fetch notes for the logged-in user
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Add a new note : POST /addnote
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3: Update an existing note : PUT /updatenote/:id
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Create a newNote object
        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow update only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 4: Delete an existing note : DELETE /deletenote/:id
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        await Notes.findByIdAndDelete(req.params.id);
        res.json({ success: "Note has been deleted", note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
