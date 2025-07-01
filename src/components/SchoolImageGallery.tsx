
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar } from 'lucide-react';
import type { School } from '@/types/database';

interface SchoolImageGalleryProps {
  schools: School[];
}

const SchoolImageGallery: React.FC<SchoolImageGalleryProps> = ({ schools }) => {
  // Mock Zambian school images - in production these would be actual school photos
  const schoolImages = [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // School building
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Classroom
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Students learning
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // School exterior
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Another school
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Library
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Science lab
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Playground
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {schools.map((school, index) => (
        <Card key={school.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg">
          <div className="relative overflow-hidden">
            <img 
              src={schoolImages[index % schoolImages.length]} 
              alt={school.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <Badge 
                variant={school.school_type === 'Private' ? 'default' : school.school_type === 'Charter' ? 'secondary' : 'outline'}
                className="bg-white/90 text-slate-800 shadow-lg"
              >
                {school.school_type}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              {school.name}
            </h3>
            <div className="flex items-center text-slate-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{school.town}{school.province ? `, ${school.province}` : ''}</span>
            </div>
            {school.description && (
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {school.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>All Grades</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>2025-2026</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SchoolImageGallery;
