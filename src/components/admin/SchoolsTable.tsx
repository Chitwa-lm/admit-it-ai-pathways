import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, School as SchoolIcon, Globe, Phone, Mail, MapPin, Users } from 'lucide-react';
import type { School } from '@/types/database';
import { useSchoolAvailableSlots } from '@/hooks/useAvailablePlacesAdmin';

interface SchoolsTableProps {
  schools: School[];
}

const SchoolsTable: React.FC<SchoolsTableProps> = ({ schools }) => {
  const { data: schoolSlots } = useSchoolAvailableSlots();
  
  const getSchoolTypeBadge = (type: string) => {
    const typeConfig = {
      Public: { variant: 'default' as const, label: 'Public' },
      Private: { variant: 'secondary' as const, label: 'Private' },
      Charter: { variant: 'outline' as const, label: 'Charter' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.Public;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getSchoolSlots = (schoolId: string) => {
    return schoolSlots?.find(slot => slot.school.id === schoolId);
  };

  if (schools.length === 0) {
    return (
      <div className="text-center py-12">
        <SchoolIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Schools Yet</h3>
        <p className="text-gray-500">
          Schools will appear here once they are added to the system.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">School</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Available Slots</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
            <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{school.name}</p>
                  {school.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {school.description}
                    </p>
                  )}
                  {school.website_url && (
                    <div className="flex items-center mt-1">
                      <Globe className="h-3 w-3 text-blue-500 mr-1" />
                      <a 
                        href={school.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                {getSchoolTypeBadge(school.school_type)}
              </td>
              <td className="py-3 px-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    {school.town}
                    {school.province && `, ${school.province}`}
                  </div>
                  {school.address && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {school.address}
                    </p>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                {(() => {
                  const slots = getSchoolSlots(school.id);
                  if (!slots) {
                    return (
                      <div className="text-sm text-gray-500">
                        No places configured
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Users className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="font-medium text-green-600">
                          {slots.totalAvailable}
                        </span>
                        <span className="text-gray-500 mx-1">/</span>
                        <span className="text-gray-900">
                          {slots.totalCapacity}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {slots.grades.length} grade level{slots.grades.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                })()}
              </td>
              <td className="py-3 px-4">
                <div className="space-y-1">
                  {school.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-3 w-3 text-gray-400 mr-1" />
                      {school.phone}
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-3 w-3 text-gray-400 mr-1" />
                      {school.email}
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchoolsTable;