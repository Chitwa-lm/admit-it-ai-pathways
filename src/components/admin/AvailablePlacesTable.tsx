import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Users, GraduationCap } from 'lucide-react';
import type { AvailablePlace } from '@/types/database';
import { format } from 'date-fns';
import { useAvailablePlacesAdmin } from '@/hooks/useAvailablePlacesAdmin';
import EditAvailablePlaceModal from './EditAvailablePlaceModal';
import AddAvailablePlaceModal from './AddAvailablePlaceModal';

interface AvailablePlacesTableProps {
  schoolId?: string;
}

const AvailablePlacesTable: React.FC<AvailablePlacesTableProps> = ({ schoolId }) => {
  const { data: availablePlaces, isLoading } = useAvailablePlacesAdmin();
  const [selectedPlace, setSelectedPlace] = useState<AvailablePlace | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return <Badge variant="default" className="bg-green-100 text-green-800">High</Badge>;
    if (percentage > 20) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    if (available > 0) return <Badge variant="destructive" className="bg-red-100 text-red-800">Low</Badge>;
    return <Badge variant="outline">Full</Badge>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading available places...</p>
      </div>
    );
  }

  // Filter by school if schoolId is provided
  const filteredPlaces = schoolId 
    ? availablePlaces?.filter(place => place.school_id === schoolId) 
    : availablePlaces;

  if (!filteredPlaces?.length) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Places</h3>
        <p className="text-gray-500 mb-4">
          No grade levels have been set up yet.
        </p>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Available Place
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Available Places</h3>
            <p className="text-sm text-gray-500">Manage grade levels and enrollment capacity</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Available Place
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">School</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Available</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Total Capacity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Deadline</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlaces.map((place) => (
                <tr key={place.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {place.schools?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {place.schools?.town}, {place.schools?.province}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{place.grade}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className={`font-medium ${getAvailabilityColor(place.available_spots, place.total_spots)}`}>
                        {place.available_spots}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-900">{place.total_spots}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">
                      {format(new Date(place.application_deadline), 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {getAvailabilityBadge(place.available_spots, place.total_spots)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPlace(place)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditAvailablePlaceModal
        place={selectedPlace}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />

      <AddAvailablePlaceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        preSelectedSchoolId={schoolId}
      />
    </>
  );
};

export default AvailablePlacesTable;