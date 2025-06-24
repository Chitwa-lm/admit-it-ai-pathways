
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Phone, Mail, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import type { AvailablePlace } from "@/types/database";

interface PlaceCardProps {
  place: AvailablePlace;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const getSchoolTypeColor = (type: string) => {
    switch (type) {
      case 'Public':
        return 'bg-blue-100 text-blue-800';
      case 'Private':
        return 'bg-green-100 text-green-800';
      case 'Charter':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{place.schools?.name}</CardTitle>
          <Badge className={getSchoolTypeColor(place.schools?.school_type || '')}>
            {place.schools?.school_type}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{place.schools?.town}</span>
          {place.schools?.province && (
            <span className="ml-2 text-gray-400">• {place.schools?.province}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Grade Level</p>
            <p className="text-sm text-gray-600">{place.grade}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Available Spots</p>
            <p className={`text-sm font-semibold ${getAvailabilityColor(place.available_spots, place.total_spots)}`}>
              {place.available_spots} of {place.total_spots}
            </p>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Deadline: {format(new Date(place.application_deadline), 'MMM dd, yyyy')}</span>
        </div>

        {place.schools?.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {place.schools.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex space-x-3">
            {place.schools?.phone && (
              <div className="flex items-center text-gray-500">
                <Phone className="h-3 w-3 mr-1" />
                <span className="text-xs">{place.schools.phone}</span>
              </div>
            )}
            {place.schools?.email && (
              <div className="flex items-center text-gray-500">
                <Mail className="h-3 w-3 mr-1" />
                <span className="text-xs">{place.schools.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            Apply Now
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
