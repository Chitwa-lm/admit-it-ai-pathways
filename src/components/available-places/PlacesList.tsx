
import { Users } from "lucide-react";
import PlaceCard from "./PlaceCard";
import type { AvailablePlace } from "@/types/database";

interface PlacesListProps {
  places: AvailablePlace[];
}

const PlacesList = ({ places }: PlacesListProps) => {
  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No places found</h3>
        <p className="text-gray-600">
          Try adjusting your search criteria or filters to find available school places.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};

export default PlacesList;
