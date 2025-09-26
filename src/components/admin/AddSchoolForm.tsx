import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Save, X } from 'lucide-react';
import { PROVINCES, SCHOOL_TYPES, DISTRICTS_BY_PROVINCE } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddSchoolFormProps {
  onSchoolAdded?: () => void;
}

interface NewSchoolData {
  name: string;
  type: string;
  province: string;
  district: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  principal_name: string;
  established_year: number | null;
  description: string;
  website_url: string;
}

const AddSchoolForm: React.FC<AddSchoolFormProps> = ({ onSchoolAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<NewSchoolData>({
    name: '',
    type: '',
    province: '',
    district: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    principal_name: '',
    established_year: null,
    description: '',
    website_url: '',
  });

  const queryClient = useQueryClient();

  const addSchoolMutation = useMutation({
    mutationFn: async (schoolData: NewSchoolData) => {
      const { error } = await supabase
        .from('schools')
        .insert([schoolData]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('School added successfully');
      setIsOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      onSchoolAdded?.();
    },
    onError: (error) => {
      toast.error('Failed to add school');
      console.error('Error adding school:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      province: '',
      district: '',
      address: '',
      contact_email: '',
      contact_phone: '',
      principal_name: '',
      established_year: null,
      description: '',
      website_url: '',
    });
  };

  const handleInputChange = (field: keyof NewSchoolData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.type || !formData.province || !formData.district) {
      toast.error('Please fill in all required fields');
      return;
    }

    addSchoolMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Add New School
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New School</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="type">School Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHOOL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => {
                      handleInputChange('province', value);
                      handleInputChange('district', ''); // Reset district when province changes
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((province) => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => handleInputChange('district', value)}
                    disabled={!formData.province}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.province && DISTRICTS_BY_PROVINCE[formData.province as keyof typeof DISTRICTS_BY_PROVINCE]?.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="established">Established Year</Label>
                  <Input
                    id="established"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.established_year || ''}
                    onChange={(e) => handleInputChange('established_year', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="e.g. 1965"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Name</Label>
                  <Input
                    id="principal"
                    value={formData.principal_name}
                    onChange={(e) => handleInputChange('principal_name', e.target.value)}
                    placeholder="Enter principal's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="school@example.edu.zm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+260 XXX XXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleInputChange('website_url', e.target.value)}
                    placeholder="https://school-website.edu.zm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete school address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">School Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter a brief description of the school, its mission, facilities, and programs..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addSchoolMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {addSchoolMutation.isPending ? 'Adding School...' : 'Add School'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolForm;