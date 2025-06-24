
import { useState } from "react";
import { useAvailablePlaces } from "@/hooks/useAvailablePlaces";
import PlaceFilters from "./available-places/PlaceFilters";
import PlacesList from "./available-places/PlacesList";

const AvailablePlaces = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");

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
  const provinces = [...new Set(availablePlaces.map(place => place.schools?.province).filter(Boolean))];

  // Filter places based on search criteria
  const filteredPlaces = availablePlaces.filter(place => {
    const matchesSearch = !searchTerm || 
      place.schools?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.schools?.town?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.schools?.province?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === "all" || place.grade === selectedGrade;
    const matchesType = selectedType === "all" || place.schools?.school_type === selectedType;
    const matchesProvince = selectedProvince === "all" || place.schools?.province === selectedProvince;
    
    return matchesSearch && matchesGrade && matchesType && matchesProvince && place.available_spots > 0;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedGrade("all");
    setSelectedType("all");
    setSelectedProvince("all");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available School Places</h2>
        <p className="text-gray-600">Find and explore available enrollment opportunities across different schools and grade levels in Zambia's 10 provinces.</p>
      </div>

      <PlaceFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        grades={grades}
        schoolTypes={schoolTypes}
        provinces={provinces}
        onClearFilters={handleClearFilters}
        filteredCount={filteredPlaces.length}
      />

      <PlacesList places={filteredPlaces} />
    </div>
  );
};

export default AvailablePlaces;
