import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, School } from 'lucide-react';

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchoolAdded: () => void;
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({ isOpen, onClose, onSchoolAdded }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    school_type: '' as 'Public' | 'Private' | 'Charter' | '',
    town: '',
    province: '',
    description: '',
    website_url: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.school_type || !formData.town) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Type, Town)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const schoolData = {
        ...formData,
        school_type: formData.school_type as 'Public' | 'Private' | 'Charter'
      };
      
      const { data, error } = await supabase
        .from('schools')
        .insert([schoolData])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "School added successfully!",
      });

      setFormData({
        name: '',
        school_type: '' as 'Public' | 'Private' | 'Charter' | '',
        town: '',
        province: '',
        description: '',
        website_url: '',
        phone: '',
        email: '',
        address: ''
      });
      
      onSchoolAdded();
      onClose();
    } catch (error: any) {
      console.error('Error adding school:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add school",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <School className="h-5 w-5 text-white" />
            </div>
            <span>Add New School</span>
          </DialogTitle>
          <DialogDescription>
            Add a new school to the Zambian education system database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">School Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter school name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_type">School Type *</Label>
              <Select value={formData.school_type} onValueChange={(value) => handleInputChange('school_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Charter">Charter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="town">Town *</Label>
              <Input
                id="town"
                value={formData.town}
                onChange={(e) => handleInputChange('town', e.target.value)}
                placeholder="Enter town"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                placeholder="Enter province"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              placeholder="Enter website URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter school description"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding School...
                </>
              ) : (
                'Add School'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolModal;