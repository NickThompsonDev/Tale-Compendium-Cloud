'use client';

import { useEffect, useState } from 'react';
import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import NPCCard from '@/components/NPCCard';
import NPCDetail from '@/components/NPCDetail';
import NPCAttributes from '@/components/NPCAttributes';
import api from '@/api';
import { NPCProps } from '@/types';
import Image from 'next/image';

const parseJSONField = (field: string | undefined): any[] => {
  try {
    if (!field) return [];
    const parsedOnce = JSON.parse(field);
    const parsedTwice = typeof parsedOnce === 'string' ? JSON.parse(parsedOnce) : parsedOnce;
    return Array.isArray(parsedTwice) ? parsedTwice : [];
  } catch (e) {
    console.error('Failed to parse JSON field:', e);
    return [];
  }
};

export default function NPCDetailsPage({ params: { npcId } }: { params: { npcId: number } }) {
  const [npc, setNpc] = useState<NPCProps | null>(null);
  const [author, setAuthor] = useState<any>(null);
  const [similarNPCs, setSimilarNPCs] = useState<NPCProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedNpc = await api.npcs.getNPCById(npcId);
        console.log("NPC Data:", fetchedNpc);
        setNpc(fetchedNpc);

        // Corrected: Fetching author by authorId instead of author
        const fetchedAuthor = await api.users.getUserById(fetchedNpc.authorId);
        setAuthor(fetchedAuthor);

        const similarNPCsResponse = await api.npcs.getNPCByAuthorId(fetchedNpc.authorId);
        setSimilarNPCs(similarNPCsResponse || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching NPC details:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [npcId]);

  if (loading) {
    return <LoaderSpinner />;
  }

  if (!npc || !author) {
    return <EmptyState title="NPC not found" buttonLink="/discover" buttonText="Discover more NPCs" />;
  }

  const isOwner = author.clerkId === npc.authorId;

  const skills = parseJSONField(npc.skills);
  const senses = parseJSONField(npc.senses);
  const languages = parseJSONField(npc.languages);
  const specialTraits = parseJSONField(npc.specialTraits);
  const actions = parseJSONField(npc.actions);

  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">NPC Details</h1>
        <figure className="flex gap-3 ">
          <Image
            src="/icons/eye.svg"
            width={24}
            height={24}
            alt="views"
            className="cl-Icon-dark"
          />
          <h2 className="text-16 font-bold text-white-1">{npc.views}</h2>
        </figure>
      </header>

      <NPCDetail
        isOwner={isOwner}
        npcId={npc.id}
        npcName={npc.npcName}
        npcDescription={npc.npcDescription}
        imageUrl={npc.imageUrl || '/path/to/default-image.png'}
        author={npc.author}
        authorId={npc.authorId}
        authorImageUrl={npc.authorImageUrl || '/path/to/default-author-image.png'}
        imageStorageId={npc.imageStorageId}
        armorClass={npc.armorClass ?? 0}
        hitPoints={npc.hitPoints ?? 0}
        challenge={npc.challenge ?? 0}
        proficiencyBonus={npc.proficiencyBonus ?? 0}
        str={npc.str ?? 0}
        dex={npc.dex ?? 0}
        con={npc.con ?? 0}
        int={npc.int ?? 0}
        wis={npc.wis ?? 0}
        cha={npc.cha ?? 0}
      />

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 p-6 mt-8 bg-black-1 mr-8">
          <NPCAttributes
            skills={skills}
            senses={senses}
            languages={languages}
            specialTraits={specialTraits}
            actions={actions}
          />
        </div>
        <p
          className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center md:w-2/3"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {npc.npcDescription}
        </p>
      </div>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar NPCs</h1>

        {similarNPCs.length > 0 ? (
          <div className="npc_grid">
            {similarNPCs.map((similarNpc: NPCProps) => (
              <NPCCard
                key={similarNpc.id}
                imgUrl={similarNpc.imageUrl || '/path/to/default-image.png'}
                title={similarNpc.npcName}
                description={similarNpc.npcDescription}
                npcId={similarNpc.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No similar NPCs found"
            buttonLink="/discover"
            buttonText="Discover more NPCs"
          />
        )}
      </section>
    </section>
  );
}
