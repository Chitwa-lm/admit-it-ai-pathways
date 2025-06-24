
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PlaceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  grades: string[];
  schoolTypes: string[];
  provinces: string[];
  onClearFilters: () => void;
  filteredCount: number;
}

const PlaceFilters = ({
  searchTerm,
  setSearchTerm,
  selectedGrade,
  setSelectedGrade,
  selectedType,
  setSelectedType,
  selectedProvince,
  setSelectedProvince,
  grades,
  schoolTypes,
  provinces,
  onClearFilters,
  filteredCount
}: PlaceFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            placeholder="Search schools, towns, or provinces..."
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
        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
          <SelectTrigger>
            <SelectValue placeholder="Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {provinces.map(province => (
              <SelectItem key={province} value={province}>{province}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredCount} available place{filteredCount !== 1 ? 's' : ''} found
        </p>
        <Button
          onClick={onClearFilters}
          variant="outline"
          size="sm"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default PlaceFilters;
