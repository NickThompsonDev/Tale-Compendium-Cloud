"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import NPCCard from "@/components/NPCCard";
import ProfileCard from "@/components/ProfileCard";
import api from "@/api";

const ProfilePage = ({
  params,
}: {
  params: {
    profileId: string;
  };
}) => {
  const [user, setUser] = useState<any>(null);
  const [npcsData, setNpcsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await api.users.getUserById(params.profileId);
        setUser(userData);

        const npcs = await api.npcs.getNPCByAuthorId(params.profileId);
        setNpcsData(npcs);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.profileId]);

  if (loading) return <LoaderSpinner />;

  if (!user || !npcsData || !Array.isArray(npcsData)) {
    return <EmptyState title="No data available" />;
  }

  // Calculate total views if npcsData is structured as an array of NPCs
  const totalViews = npcsData.reduce(
    (sum: number, npc: { views: number }) => sum + (npc.views || 0),
    0
  );

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Creator Profile
      </h1>
      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          npcData={{ npcs: npcsData, viewers: totalViews }}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>
      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">All NPCs</h1>
        {npcsData.length > 0 ? (
          <div className="npc_grid">
            {npcsData
              .filter((npc: any) => npc.id != null) // Filter out invalid IDs
              .slice(0, 4)
              .map((npc: {
                id: number;
                imageUrl: string;
                npcName: string;
                npcDescription: string;
              }) => (
                <NPCCard
                  key={npc.id}
                  imgUrl={npc.imageUrl!}
                  title={npc.npcName!}
                  description={npc.npcDescription}
                  npcId={npc.id}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any NPCs yet"
            buttonLink="/create-npc"
            buttonText="Create NPC"
          />
        )}
      </section>
    </section>
  );
};

export default ProfilePage;
