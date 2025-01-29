const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware')
const {review} = require('../models/review')

const reviewRouter = express.Router(); 

reviewRouter.get('/:id',  async (req, res) =>{

    try {
        if (req.params.id) {

            const review = await review.find({Review_id:req.params.id}).populate('viewer_id', 'name')
            
            if (!review) {
                return res.status(404).json({ message: 'No reviews' });
            }

            res.json(review);

        } 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Reviews', error: error.message });
    }
})

reviewRouter.post('/add',authMiddle, async  (req, res) => {
    try {


        const newReview = new review({
            ...req.body
        });

        const savedReview = await newReview.save();
        res.json({
            message: 'Review added successfully',
        });

    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
})

reviewRouter.patch('/update:id', authMiddle, async (req, res) => {
    try {

        const updatedReview = await review.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
        );

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json({
            message: 'Review updated successfully', 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
})

reviewRouter.delete('/delete/:id', authMiddle, async (req, res) =>{
    try {

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const deletedReview = await review.findByIdAndDelete(req.params.id);
        
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
    
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
})

module.exports = {reviewRouter}