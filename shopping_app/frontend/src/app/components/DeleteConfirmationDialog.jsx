import React from 'react';
import { Button } from "@/components/ui/button";

const DeleteConfirmationDialog = React.memo(({ 
  isOpen, 
  onOpenChange, 
  onConfirmDelete 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete this review?</p>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
});

export default DeleteConfirmationDialog;