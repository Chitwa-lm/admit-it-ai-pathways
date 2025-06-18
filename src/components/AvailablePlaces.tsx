
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Calendar } from "lucide-react";

interface SchoolPlace {
  id: string;
  schoolName: string;
  grade: string;
  availableSpots: number;
  location: string;
  applicationDeadline: string;
  schoolType: "Public" | "Private" | "Charter";
}

const mockAvailablePlaces: SchoolPlace[] = [
  {
    id: "1",
    schoolName: "Lincoln Elementary School",
    grade: "Kindergarten",
    availableSpots: 25,
    location: "Downtown District",
    applicationDeadline: "2024-03-15",
    schoolType: "Public"
  },
  {
    id: "2",
    schoolName: "Washington Middle School",
    grade: "6th Grade",
    availableSpots: 18,
    location: "North District",
    applicationDeadline: "2024-02-28",
    schoolType: "Public"
  },
  {
    id: "3",
    schoolName: "Roosevelt High School",
    grade: "9th Grade",
    availableSpots: 32,
    location: "East District",
    applicationDeadline: "2024-04-01",
    schoolType: "Public"
  },
  {
    id: "4",
    schoolName: "St. Mary's Academy",
    grade: "3rd Grade",
    availableSpots: 12,
    location: "Central District",
    applicationDeadline: "2024-03-01",
    schoolType: "Private"
  },
  {
    id: "5",
    schoolName: "Innovation Charter School",
    grade: "7th Grade",
    availableSpots: 8,
    location: "West District",
    applicationDeadline: "2024-03-20",
    schoolType: "Charter"
  }
];

const AvailablePlaces = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const filteredPlaces = mockAvailablePlaces.filter(place => {
    const matchesSearch = place.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !selectedGrade || place.grade.includes(selectedGrade);
    const matchesType = !selectedType || place.schoolType === selectedType;
    
    return matchesSearch && matchesGrade && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Public": return "bg-blue-100 text-blue-800";
      case "Private": return "bg-purple-100 text-purple-800";
      case "Charter": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (spots: number) => {
    if (spots > 20) return "text-green-600";
    if (spots > 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Available School Places</h2>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Schools</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by school or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade">Grade Level</Label>
            <select
              id="grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">All Grades</option>
              <option value="Kindergarten">Kindergarten</option>
              <option value="1st">1st Grade</option>
              <option value="2nd">2nd Grade</option>
              <option value="3rd">3rd Grade</option>
              <option value="4th">4th Grade</option>
              <option value="5th">5th Grade</option>
              <option value="6th">6th Grade</option>
              <option value="7th">7th Grade</option>
              <option value="8th">8th Grade</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">School Type</Label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">All Types</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Charter">Charter</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedGrade("");
                setSelectedType("");
              }}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlaces.map((place) => (
          <Card key={place.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{place.schoolName}</CardTitle>
                <Badge className={getTypeColor(place.schoolType)}>
                  {place.schoolType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>Grade: {place.grade}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{place.location}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Available spots:</span>
                  <span className={`font-semibold ${getAvailabilityColor(place.availableSpots)}`}>
                    {place.availableSpots}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {new Date(place.applicationDeadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Button className="w-full">
                Apply for This School
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No available places found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailablePlaces;
