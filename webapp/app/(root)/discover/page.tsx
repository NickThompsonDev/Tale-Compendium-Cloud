"use client";

import { useEffect, useState } from 'react';
import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import NPCCard from '@/components/NPCCard';
import Searchbar from '@/components/Searchbar';
import api from '@/api';

interface NPC {
  id: number;
  npcName: string;
  npcDescription: string;
  imageUrl?: string;
}

const Discover = ({ searchParams: { search } }: { searchParams: { search: string } }) => {
  const [npcsData, setNpcsData] = useState<NPC[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNPCs = async () => {
      setIsLoading(true);
      try {
        const data = await api.npcs.getNPCBySearch(search || '');
        setNpcsData(data);
      } catch (error) {
        console.error('Error fetching NPCs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNPCs();
  }, [search]);

  return (
    <div className="flex flex-col gap-9">
      <Searchbar />
      <div className="flex flex-col gap-9">
        <h1 className="text-20 font-bold text-white-1">
          {!search ? 'Discover Trending Creations' : 'Search results for '}
          {search && <span className="text-white-2">{search}</span>}
        </h1>
        {isLoading ? (
          <LoaderSpinner />
        ) : (
          <>
            {npcsData && npcsData.length > 0 ? (
              <div className="npc_grid">
                {npcsData.map(({ id, npcName, npcDescription, imageUrl }: NPC) => (
                  <NPCCard
                    key={id}
                    imgUrl={imageUrl as string}
                    title={npcName}
                    description={npcDescription}
                    npcId={id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No results found" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Discover;
