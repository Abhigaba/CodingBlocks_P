import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

import ReviewList from './ReviewList';
import ReviewModal from './ReviewModal';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const ProductReviews = ({ productId, productName, userId }) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/review/${productId}`, { 
        withCredentials: true 
      });
      
      setReviews(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive"
      });
    }
  }, [productId, toast]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = useCallback(async (reviewData) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing) {
        await axios.patch(`http://localhost:3000/review/update/${selectedReview._id}`, {
          ...reviewData,
          viewer_id: userId
        }, { withCredentials: true });
      } else {
        const exists = reviews.findIndex(item => item.viewer_id._id === userId);
        if (exists >= 0) {
          toast({
            title: "Review Already Exists",
            description: "You have already reviewed this product. You can edit your existing review.",
            variant: "destructive"
          });
          setIsReviewModalOpen(false);
          return;
        }
        
        await axios.post(`http://localhost:3000/review/add`, {
          product_id: productId,
          viewer_id: userId,
          ...reviewData
        }, { withCredentials: true });
      }
      
      setIsReviewModalOpen(false);
      setIsEditing(false);
      setSelectedReview(null);
      fetchReviews();

      toast({
        title: isEditing ? "Review updated" : "Review submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'submit'} review. Please try again.`,
        variant: "destructive"
      });
    }
  }, [
    userId, 
    isEditing, 
    selectedReview, 
    reviews, 
    productId, 
    toast, 
    fetchReviews
  ]);

  const handleEditReview = useCallback((review) => {
    setSelectedReview(review);
    setIsEditing(true);
    setIsReviewModalOpen(true);
  }, []);

  const handleDeleteReview = useCallback(async () => {
    try {
      await axios.delete(`http://localhost:3000/review/delete/${selectedReview._id}`, {
        withCredentials: true
      });

      setIsDeleteDialogOpen(false);
      setSelectedReview(null);
      fetchReviews();
      
      toast({
        title: "Review deleted",
        description: "Your review has been removed successfully."
      });
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive"
      });
    }
  }, [selectedReview, toast, fetchReviews]);

  const openDeleteDialog = useCallback((review) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  }, []);

  const openReviewModal = useCallback(() => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please log in to write a review.",
        variant: "destructive"
      });
      return;
    }
    setIsEditing(false);
    setSelectedReview(null);
    setIsReviewModalOpen(true);
  }, [userId, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Button onClick={openReviewModal}>
          Write a Review
        </Button>
      </div>

      <ReviewList 
        reviews={reviews}
        userId={userId}
        productName={productName}
        onEdit={handleEditReview}
        onDelete={openDeleteDialog}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        isEditing={isEditing}
        productName={productName}
        initialReview={
          isEditing ? 
            { rating: selectedReview?.rating || 5, description: selectedReview?.description || '' } 
            : undefined
        }
        onSubmit={handleSubmitReview}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteReview}
      />
    </div>
  );
};

export default ProductReviews;