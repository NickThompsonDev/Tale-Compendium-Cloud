"use client";

import { NPCCardProps } from '@/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import api from '@/api';

const NPCCard = ({ imgUrl, title, description, npcId }: NPCCardProps) => {
  const router = useRouter();

  const handleViews = async () => {
    try {
      // Use the API method to update the view count
      await api.npcs.updateNpcViews(npcId);
      router.push(`/npcs/${npcId}`, {
        scroll: true,
      });
    } catch (error) {
      console.error('Failed to update NPC views', error);
    }
  };

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-2">
        <Image 
          src={imgUrl}
          width={174}
          height={174}
          alt={title}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
          crossOrigin="anonymous"
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal capitalize text-white-4">{description}</h2>
        </div>
      </figure>
    </div>
  );
};

export default NPCCard;
