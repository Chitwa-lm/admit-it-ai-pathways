
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Phone, Mail, ExternalLink } from "lucide-react";
import { useAvailablePlaces } from "@/hooks/useAvailablePlaces";
import { format } from "date-fns";

const AvailablePlaces = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  const { data: availablePlaces = [], isLoading, error } = useAvailablePlaces();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading available places...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading available places: {error.message}</p>
      </div>
    );
  }

  // Get unique values for filters
  const grades = [...new Set(availablePlaces.map(place => place.grade))].sort();
  const schoolTypes = [...new Set(availablePlaces.map(place => place.schools?.school_type).filter(Boolean))];
  const districts = [...new Set(availablePlaces.map(place => place.schools?.district).filter(Boolean))];

  // Filter places based on search criteria
  const filteredPlaces = availablePlaces.filter(place => {
    const matchesSearch = !searchTerm || 
      place.schools?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.schools?.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.schools?.district?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === "all" || place.grade === selectedGrade;
    const matchesType = selectedType === "all" || place.schools?.school_type === selectedType;
    const matchesDistrict = selectedDistrict === "all" || place.schools?.district === selectedDistrict;
    
    return matchesSearch && matchesGrade && matchesType && matchesDistrict && place.available_spots > 0;
  });

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available School Places</h2>
        <p className="text-gray-600">Find and explore available enrollment opportunities across different schools and grade levels.</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            placeholder="Search schools, locations, or districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger>
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {grades.map(grade => (
              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="School Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {schoolTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger>
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map(district => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredPlaces.length} available place{filteredPlaces.length !== 1 ? 's' : ''} found
        </p>
        <Button
          onClick={() => {
            setSearchTerm("");
            setSelectedGrade("all");
            setSelectedType("all");
            setSelectedDistrict("all");
          }}
          variant="outline"
          size="sm"
        >
          Clear Filters
        </Button>
      </div>

      {/* Available Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <Card key={place.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{place.schools?.name}</CardTitle>
                <Badge className={getSchoolTypeColor(place.schools?.school_type || '')}>
                  {place.schools?.school_type}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{place.schools?.location}</span>
                {place.schools?.district && (
                  <span className="ml-2 text-gray-400">• {place.schools?.district}</span>
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
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No places found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find available school places.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailablePlaces;
