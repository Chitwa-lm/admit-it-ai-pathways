import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    Plus,
    Edit,
    Save,
    X,
    Trash2,
    Calendar,
    DollarSign,
    School,
    Filter,
    Download,
    Upload
} from 'lucide-react';
import { AvailablePlace, School as SchoolType } from '@/types/database';
import { GRADE_LEVELS, PROVINCES, SCHOOL_TYPES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AvailablePlacesManagerProps {
    schools: SchoolType[];
}

const AvailablePlacesManager: React.FC<AvailablePlacesManagerProps> = ({ schools }) => {
    const [selectedSchool, setSelectedSchool] = useState<string>('all');
    const [selectedProvince, setSelectedProvince] = useState<string>('all');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [editingPlace, setEditingPlace] = useState<string | null>(null);
    const [newPlace, setNewPlace] = useState<Partial<AvailablePlace> | null>(null);

    const queryClient = useQueryClient();

    // Fetch available places with filters
    const { data: availablePlaces, isLoading } = useQuery({
        queryKey: ['availablePlaces', selectedSchool, selectedProvince, selectedGrade],
        queryFn: async () => {
            let query = supabase
                .from('available_places')
                .select(`
          *,
          schools (
            id,
            name,
            type,
            province,
            district
          )
        `)
                .order('created_at', { ascending: false });

            if (selectedSchool !== 'all') {
                query = query.eq('school_id', selectedSchool);
            }

            if (selectedGrade !== 'all') {
                query = query.eq('grade_level', selectedGrade);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Filter by province if needed (since we can't directly filter on joined table)
            let filteredData = data;
            if (selectedProvince !== 'all') {
                filteredData = data.filter(place =>
                    place.schools && place.schools.province === selectedProvince
                );
            }

            return filteredData as (AvailablePlace & { schools: SchoolType })[];
        },
    });

    // Update available place mutation
    const updatePlaceMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<AvailablePlace> }) => {
            const { error } = await supabase
                .from('available_places')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Available places updated successfully');
            setEditingPlace(null);
            queryClient.invalidateQueries({ queryKey: ['availablePlaces'] });
        },
        onError: (error) => {
            toast.error('Failed to update available places');
            console.error('Error updating places:', error);
        },
    });

    // Add new available place mutation
    const addPlaceMutation = useMutation({
        mutationFn: async (placeData: Partial<AvailablePlace>) => {
            const { error } = await supabase
                .from('available_places')
                .insert([placeData]);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Available places added successfully');
            setNewPlace(null);
            queryClient.invalidateQueries({ queryKey: ['availablePlaces'] });
        },
        onError: (error) => {
            toast.error('Failed to add available places');
            console.error('Error adding places:', error);
        },
    });

    // Delete available place mutation
    const deletePlaceMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('available_places')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Available places deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['availablePlaces'] });
        },
        onError: (error) => {
            toast.error('Failed to delete available places');
            console.error('Error deleting places:', error);
        },
    });

    const handleUpdatePlace = (id: string, field: keyof AvailablePlace, value: any) => {
        updatePlaceMutation.mutate({ id, updates: { [field]: value } });
    };

    const handleAddNewPlace = () => {
        if (!newPlace || !newPlace.school_id || !newPlace.grade_level) {
            toast.error('Please fill in all required fields');
            return;
        }

        const placeData = {
            ...newPlace,
            total_places: newPlace.total_places || 30,
            available_places: newPlace.available_places || 30,
            academic_year: newPlace.academic_year || '2024',
            fees: newPlace.fees || 0,
        };

        addPlaceMutation.mutate(placeData);
    };

    const getSchoolTypeColor = (type: string) => {
        switch (type) {
            case 'government': return 'bg-blue-100 text-blue-800';
            case 'private': return 'bg-green-100 text-green-800';
            case 'trust_grant_aided': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getAvailabilityColor = (available: number, total: number) => {
        const percentage = (available / total) * 100;
        if (percentage > 50) return 'text-green-600';
        if (percentage > 20) return 'text-yellow-600';
        return 'text-red-600';
    };

    const filteredSchools = schools.filter(school =>
        selectedProvince === 'all' || school.province === selectedProvince
    );

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Filter className="h-5 w-5" />
                        <span>Filters</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Province</Label>
                            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Provinces</SelectItem>
                                    {PROVINCES.map((province) => (
                                        <SelectItem key={province.value} value={province.value}>
                                            {province.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>School</Label>
                            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Schools</SelectItem>
                                    {filteredSchools.map((school) => (
                                        <SelectItem key={school.id} value={school.id}>
                                            {school.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Grade Level</Label>
                            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Grades</SelectItem>
                                    {GRADE_LEVELS.map((grade) => (
                                        <SelectItem key={grade.value} value={grade.value}>
                                            {grade.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end space-x-2">
                            <Button
                                onClick={() => setNewPlace({
                                    school_id: selectedSchool !== 'all' ? selectedSchool : '',
                                    grade_level: selectedGrade !== 'all' ? selectedGrade as any : 'grade_1',
                                    total_places: 30,
                                    available_places: 30,
                                    academic_year: '2024',
                                    fees: 0,
                                })}
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Places
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add New Place Form */}
            {newPlace && (
                <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center space-x-2">
                                <Plus className="h-5 w-5 text-green-600" />
                                <span>Add New Available Places</span>
                            </span>
                            <Button
                                onClick={() => setNewPlace(null)}
                                variant="ghost"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="space-y-2">
                                <Label>School</Label>
                                <Select
                                    value={newPlace.school_id || ''}
                                    onValueChange={(value) => setNewPlace({ ...newPlace, school_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select school" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredSchools.map((school) => (
                                            <SelectItem key={school.id} value={school.id}>
                                                {school.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Grade Level</Label>
                                <Select
                                    value={newPlace.grade_level || ''}
                                    onValueChange={(value) => setNewPlace({ ...newPlace, grade_level: value as any })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select grade" />
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
                                    value={newPlace.total_places || ''}
                                    onChange={(e) => setNewPlace({ ...newPlace, total_places: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Available Places</Label>
                                <Input
                                    type="number"
                                    value={newPlace.available_places || ''}
                                    onChange={(e) => setNewPlace({ ...newPlace, available_places: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Academic Year</Label>
                                <Input
                                    value={newPlace.academic_year || ''}
                                    onChange={(e) => setNewPlace({ ...newPlace, academic_year: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Fees (ZMW)</Label>
                                <Input
                                    type="number"
                                    value={newPlace.fees || ''}
                                    onChange={(e) => setNewPlace({ ...newPlace, fees: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button
                                onClick={() => setNewPlace(null)}
                                variant="outline"
                                size="sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddNewPlace}
                                size="sm"
                                disabled={addPlaceMutation.isPending}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Add Places
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Available Places List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Available Places ({availablePlaces?.length || 0})</span>
                        </span>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Import
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading available places...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {availablePlaces?.map((place) => (
                                <Card key={place.id} className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h3 className="font-medium">{place.schools?.name}</h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge className={getSchoolTypeColor(place.schools?.type || '')}>
                                                        {SCHOOL_TYPES.find(t => t.value === place.schools?.type)?.label}
                                                    </Badge>
                                                    <span className="text-sm text-gray-600">
                                                        {place.schools?.district}, {place.schools?.province}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => setEditingPlace(editingPlace === place.id ? null : place.id)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
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

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Grade Level</Label>
                                            {editingPlace === place.id ? (
                                                <Select
                                                    value={place.grade_level}
                                                    onValueChange={(value) => handleUpdatePlace(place.id, 'grade_level', value)}
                                                >
                                                    <SelectTrigger className="h-8">
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
                                            ) : (
                                                <p className="text-sm font-medium">
                                                    {GRADE_LEVELS.find(g => g.value === place.grade_level)?.label}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Total Places</Label>
                                            {editingPlace === place.id ? (
                                                <Input
                                                    type="number"
                                                    value={place.total_places}
                                                    onChange={(e) => handleUpdatePlace(place.id, 'total_places', parseInt(e.target.value))}
                                                    className="h-8"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium">{place.total_places}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Available</Label>
                                            {editingPlace === place.id ? (
                                                <Input
                                                    type="number"
                                                    value={place.available_places}
                                                    onChange={(e) => handleUpdatePlace(place.id, 'available_places', parseInt(e.target.value))}
                                                    className="h-8"
                                                />
                                            ) : (
                                                <p className={`text-sm font-medium ${getAvailabilityColor(place.available_places, place.total_places)}`}>
                                                    {place.available_places}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Academic Year</Label>
                                            {editingPlace === place.id ? (
                                                <Input
                                                    value={place.academic_year}
                                                    onChange={(e) => handleUpdatePlace(place.id, 'academic_year', e.target.value)}
                                                    className="h-8"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium">{place.academic_year}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Deadline</Label>
                                            {editingPlace === place.id ? (
                                                <Input
                                                    type="date"
                                                    value={place.application_deadline || ''}
                                                    onChange={(e) => handleUpdatePlace(place.id, 'application_deadline', e.target.value)}
                                                    className="h-8"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium">
                                                    {place.application_deadline ? new Date(place.application_deadline).toLocaleDateString() : 'Not set'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs">Fees (ZMW)</Label>
                                            {editingPlace === place.id ? (
                                                <Input
                                                    type="number"
                                                    value={place.fees || 0}
                                                    onChange={(e) => handleUpdatePlace(place.id, 'fees', parseFloat(e.target.value))}
                                                    className="h-8"
                                                />
                                            ) : (
                                                <p className="text-sm font-medium">
                                                    {place.fees ? `K${place.fees.toLocaleString()}` : 'Free'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {(!availablePlaces || availablePlaces.length === 0) && (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">No Available Places Found</h3>
                                    <p className="text-sm">
                                        {selectedSchool !== 'all' || selectedProvince !== 'all' || selectedGrade !== 'all'
                                            ? 'Try adjusting your filters or add new places for the selected criteria.'
                                            : 'Click "Add Places" to create available places for schools.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AvailablePlacesManager;