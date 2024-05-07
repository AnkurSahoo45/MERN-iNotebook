const express = require('express')
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req, res) =>{
    const notes = await Notes.find({user: req.user.id});
    res.send(notes);
})

router.post('/addnote', fetchuser, body('title').isLength({ min: 3}), body('description').isLength({ min: 10}), async (req, res) =>{
    const {title, description, tag} = req.body;
    const result = validationResult(req);
    if(result.isEmpty()){
        const note = new Notes({
            title, description, tag, user: req.user.id
        });
        await note.save();
        return res.send(note);
    }
    res.status(409).json({ errors: result.array() });
})

router.put('/updatenote/:id', fetchuser, async (req, res) =>{
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};
    var note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
    res.send(note);
})

router.delete('/deletenote/:id', fetchuser, async (req, res) =>{
    var note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.send({"Success": "Note has been deleted successfully", note: note});
})

module.exports = router