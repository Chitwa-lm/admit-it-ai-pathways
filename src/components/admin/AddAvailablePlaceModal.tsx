import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAvailablePlacesAdmin } from '@/hooks/useAvailablePlacesAdmin';
import { useSchools } from '@/hooks/useSchools';
import { Constants } from '@/integrations/supabase/types';

interface AddAvailablePlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedSchoolId?: string;
}

const AddAvailablePlaceModal: React.FC<AddAvailablePlaceModalProps> = ({
  isOpen,
  onClose,
  preSelectedSchoolId,
}) => {
  const { addAvailablePlace } = useAvailablePlacesAdmin();
  const { data: schools } = useSchools();
  const [formData, setFormData] = useState({
    school_id: preSelectedSchoolId || '',
    grade: '',
    available_spots: 0,
    total_spots: 0,
    application_deadline: '',
    academic_year: '2024-2025',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addAvailablePlace.mutateAsync(formData);
    onClose();
    
    // Reset form
    setFormData({
      school_id: preSelectedSchoolId || '',
      grade: '',
      available_spots: 0,
      total_spots: 0,
      application_deadline: '',
      academic_year: '2024-2025',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Available Place</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!preSelectedSchoolId && (
            <div>
              <Label htmlFor="school_id">School</Label>
              <Select value={formData.school_id} onValueChange={(value) => setFormData(prev => ({ ...prev, school_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools?.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name} - {school.town}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
            <Label htmlFor="total_spots">Total Capacity</Label>
            <Input
              id="total_spots"
              type="number"
              min="1"
              value={formData.total_spots}
              onChange={(e) => {
                const totalSpots = parseInt(e.target.value) || 0;
                setFormData(prev => ({ 
                  ...prev, 
                  total_spots: totalSpots,
                  available_spots: Math.min(prev.available_spots, totalSpots)
                }));
              }}
              required
            />
          </div>

          <div>
            <Label htmlFor="available_spots">Available Spots</Label>
            <Input
              id="available_spots"
              type="number"
              min="0"
              max={formData.total_spots}
              value={formData.available_spots}
              onChange={(e) => setFormData(prev => ({ ...prev, available_spots: parseInt(e.target.value) || 0 }))}
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
            <Button type="submit" disabled={addAvailablePlace.isPending}>
              {addAvailablePlace.isPending ? 'Adding...' : 'Add Place'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAvailablePlaceModal;