import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  School, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar,
  Building,
  Users,
  DollarSign
} from 'lucide-react';
import { School as SchoolType, AvailablePlace } from '@/types/database';
import { PROVINCES, SCHOOL_TYPES, GRADE_LEVELS, DISTRICTS_BY_PROVINCE } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SchoolManagementProps {
  schools: SchoolType[];
  onSchoolUpdated?: () => void;
}

const SchoolManagement: React.FC<SchoolManagementProps> = ({ schools, onSchoolUpdated }) => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch available places for selected school
  const { data: availablePlaces, isLoading: placesLoading } = useQuery({
    queryKey: ['availablePlaces', selectedSchool?.id],
    queryFn: async () => {
      if (!selectedSchool?.id) return [];
      
      const { data, error } = await supabase
        .from('available_places')
        .select('*')
        .eq('school_id', selectedSchool.id)
        .order('grade_level');

      if (error) throw error;
      return data as AvailablePlace[];
    },
    enabled: !!selectedSchool?.id,
  });

  // Update school mutation
  const updateSchoolMutation = useMutation({
    mutationFn: async (updatedSchool: Partial<SchoolType>) => {
      const { error } = await supabase
        .from('schools')
        .update(updatedSchool)
        .eq('id', selectedSchool!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('School updated successfully');
      setIsEditing(false);
      setEditingSchool(null);
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      onSchoolUpdated?.();
    },
    onError: (error) => {
      toast.error('Failed to update school');
      console.error('Error updating school:', error);
    },
  });

  // Add/Update available place mutation
  const updatePlaceMutation = useMutation({
    mutationFn: async (place: Partial<AvailablePlace>) => {
      if (place.id) {
        // Update existing place
        const { error } = await supabase
          .from('available_places')
          .update(place)
          .eq('id', place.id);
        if (error) throw error;
      } else {
        // Create new place
        const { error } = await supabase
          .from('available_places')
          .insert({ ...place, school_id: selectedSchool!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Available places updated successfully');
      queryClient.invalidateQueries({ queryKey: ['availablePlaces', selectedSchool?.id] });
    },
    onError: (error) => {
      toast.error('Failed to update available places');
      console.error('Error updating places:', error);
    },
  });

  // Delete available place mutation
  const deletePlaceMutation = useMutation({
    mutationFn: async (placeId: string) => {
      const { error } = await supabase
        .from('available_places')
        .delete()
        .eq('id', placeId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Available place deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['availablePlaces', selectedSchool?.id] });
    },
    onError: (error) => {
      toast.error('Failed to delete available place');
      console.error('Error deleting place:', error);
    },
  });

  const handleEditSchool = () => {
    setEditingSchool({ ...selectedSchool! });
    setIsEditing(true);
  };

  const handleSaveSchool = () => {
    if (editingSchool) {
      updateSchoolMutation.mutate(editingSchool);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSchool(null);
  };

  const handleInputChange = (field: keyof SchoolType, value: any) => {
    if (editingSchool) {
      setEditingSchool({ ...editingSchool, [field]: value });
    }
  };

  const handleAddPlace = () => {
    const newPlace: Partial<AvailablePlace> = {
      school_id: selectedSchool!.id,
      grade_level: 'grade_1',
      total_places: 30,
      available_places: 30,
      academic_year: '2024',
      application_deadline: '2024-02-28',
      requirements: ['Birth Certificate', 'Medical Report'],
      fees: selectedSchool!.type === 'government' ? 0 : 5000,
    };
    updatePlaceMutation.mutate(newPlace);
  };

  const handleUpdatePlace = (place: AvailablePlace, field: keyof AvailablePlace, value: any) => {
    const updatedPlace = { ...place, [field]: value };
    updatePlaceMutation.mutate(updatedPlace);
  };

  const getSchoolTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-green-100 text-green-800';
      case 'trust_grant_aided': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Schools List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <School className="h-5 w-5" />
            <span>Schools ({schools.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {schools.map((school) => (
            <div
              key={school.id}
              onClick={() => setSelectedSchool(school)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedSchool?.id === school.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{school.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {school.district}, {school.province}
                  </p>
                  <Badge className={`text-xs mt-2 ${getSchoolTypeColor(school.type)}`}>
                    {SCHOOL_TYPES.find(t => t.value === school.type)?.label}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* School Details */}
      <Card className="lg:col-span-2">
        {selectedSchool ? (
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>{selectedSchool.name}</span>
                </CardTitle>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <Button onClick={handleEditSchool} size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit School
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSaveSchool} 
                        size="sm"
                        disabled={updateSchoolMutation.isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="details">School Details</TabsTrigger>
                  <TabsTrigger value="places">Available Places</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">School Name</Label>
                      <Input
                        id="name"
                        value={isEditing ? editingSchool?.name || '' : selectedSchool.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">School Type</Label>
                      <Select
                        value={isEditing ? editingSchool?.type : selectedSchool.type}
                        onValueChange={(value) => handleInputChange('type', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label htmlFor="province">Province</Label>
                      <Select
                        value={isEditing ? editingSchool?.province : selectedSchool.province}
                        onValueChange={(value) => handleInputChange('province', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label htmlFor="district">District</Label>
                      <Select
                        value={isEditing ? editingSchool?.district : selectedSchool.district}
                        onValueChange={(value) => handleInputChange('district', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {editingSchool?.province && DISTRICTS_BY_PROVINCE[editingSchool.province as keyof typeof DISTRICTS_BY_PROVINCE]?.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="principal">Principal Name</Label>
                      <Input
                        id="principal"
                        value={isEditing ? editingSchool?.principal_name || '' : selectedSchool.principal_name || ''}
                        onChange={(e) => handleInputChange('principal_name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="established">Established Year</Label>
                      <Input
                        id="established"
                        type="number"
                        value={isEditing ? editingSchool?.established_year || '' : selectedSchool.established_year || ''}
                        onChange={(e) => handleInputChange('established_year', parseInt(e.target.value))}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Contact Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={isEditing ? editingSchool?.contact_email || '' : selectedSchool.contact_email || ''}
                        onChange={(e) => handleInputChange('contact_email', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        value={isEditing ? editingSchool?.contact_phone || '' : selectedSchool.contact_phone || ''}
                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={isEditing ? editingSchool?.address || '' : selectedSchool.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={isEditing ? editingSchool?.description || '' : selectedSchool.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="places" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Available Places</h3>
                    <Button onClick={handleAddPlace} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Grade Level
                    </Button>
                  </div>

                  {placesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading available places...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availablePlaces?.map((place) => (
                        <Card key={place.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Grade Level</Label>
                              <Select
                                value={place.grade_level}
                                onValueChange={(value) => handleUpdatePlace(place, 'grade_level', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GRADE_LEVELS.map((grade) => (
                                    <SelectItem key={grade.value} value={grade.value}>
                                      {grade.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Total Places</Label>
                              <Input
                                type="number"
                                value={place.total_places}
                                onChange={(e) => handleUpdatePlace(place, 'total_places', parseInt(e.target.value))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Available Places</Label>
                              <Input
                                type="number"
                                value={place.available_places}
                                onChange={(e) => handleUpdatePlace(place, 'available_places', parseInt(e.target.value))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Fees (ZMW)</Label>
                              <Input
                                type="number"
                                value={place.fees || 0}
                                onChange={(e) => handleUpdatePlace(place, 'fees', parseFloat(e.target.value))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Academic Year</Label>
                              <Input
                                value={place.academic_year}
                                onChange={(e) => handleUpdatePlace(place, 'academic_year', e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Application Deadline</Label>
                              <Input
                                type="date"
                                value={place.application_deadline || ''}
                                onChange={(e) => handleUpdatePlace(place, 'application_deadline', e.target.value)}
                              />
                            </div>

                            <div className="flex items-end">
                              <Button
                                onClick={() => deletePlaceMutation.mutate(place.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {(!availablePlaces || availablePlaces.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No available places configured for this school.</p>
                          <p className="text-sm">Click "Add Grade Level" to get started.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        ) : (
          <CardContent className="text-center py-12">
            <School className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a School</h3>
            <p className="text-gray-600">Choose a school from the list to view and edit its details.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SchoolManagement;