import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AvailablePlace } from '@/types/database';
import { useAvailablePlacesAdmin } from '@/hooks/useAvailablePlacesAdmin';
import { Constants } from '@/integrations/supabase/types';

interface EditAvailablePlaceModalProps {
  place: AvailablePlace | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditAvailablePlaceModal: React.FC<EditAvailablePlaceModalProps> = ({
  place,
  isOpen,
  onClose,
}) => {
  const { updateAvailablePlace } = useAvailablePlacesAdmin();
  const [formData, setFormData] = useState({
    grade: '',
    available_spots: 0,
    total_spots: 0,
    application_deadline: '',
    academic_year: '',
  });

  useEffect(() => {
    if (place) {
      setFormData({
        grade: place.grade,
        available_spots: place.available_spots,
        total_spots: place.total_spots,
        application_deadline: place.application_deadline,
        academic_year: place.academic_year,
      });
    }
  }, [place]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!place) return;

    await updateAvailablePlace.mutateAsync({
      id: place.id,
      updates: formData,
    });
    onClose();
  };

  if (!place) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Available Place</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="grade">Grade Level</Label>
            <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {Constants.public.Enums.grade_level.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="available_spots">Available Spots</Label>
            <Input
              id="available_spots"
              type="number"
              min="0"
              value={formData.available_spots}
              onChange={(e) => setFormData(prev => ({ ...prev, available_spots: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="total_spots">Total Capacity</Label>
            <Input
              id="total_spots"
              type="number"
              min="1"
              value={formData.total_spots}
              onChange={(e) => setFormData(prev => ({ ...prev, total_spots: parseInt(e.target.value) || 0 }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="application_deadline">Application Deadline</Label>
            <Input
              id="application_deadline"
              type="date"
              value={formData.application_deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="academic_year">Academic Year</Label>
            <Input
              id="academic_year"
              value={formData.academic_year}
              onChange={(e) => setFormData(prev => ({ ...prev, academic_year: e.target.value }))}
              placeholder="e.g., 2024-2025"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateAvailablePlace.isPending}>
              {updateAvailablePlace.isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAvailablePlaceModal;