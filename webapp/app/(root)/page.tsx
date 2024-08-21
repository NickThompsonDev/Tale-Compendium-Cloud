"use client";

import React, { useState, useEffect } from 'react';
import NPCCard from '@/components/NPCCard';
import api from '@/api';
import LoaderSpinner from '@/components/LoaderSpinner';
import { NPCProps } from '@/types';

export default function Home() {
  const [trendingNPCs, setTrendingNPCs] = useState<NPCProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingNPCs = async () => {
      try {
        const data = await api.npcs.getTrendingNPCs();
        setTrendingNPCs(data);
      } catch (error) {
        console.error('Error fetching trending NPCs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingNPCs();
  }, []);

  if (isLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending NPCs</h1>
        <div className="npc_grid">
          {trendingNPCs?.map(({ id, npcName, npcDescription, imageUrl }) => (
            <NPCCard
              key={id}
              imgUrl={imageUrl || ''}
              title={npcName}
              description={npcDescription}
              npcId={id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
