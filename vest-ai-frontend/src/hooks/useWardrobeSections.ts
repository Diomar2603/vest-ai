import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface WardrobeSection {
  _id: string;
  name: string;
}

export function useWardrobeSections() {
  const [sections, setSections] = useState<WardrobeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`${API_URL}/wardrobe/sections`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error();
        
        const data = await response.json();
        setSections(data);
      } catch (error) {
        toast.error("Erro ao carregar seções do guarda-roupa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  return { sections, isLoading };
}