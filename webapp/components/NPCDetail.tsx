'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import api from '@/api'
import { NPCDetailProps } from "@/types";

import LoaderSpinner from "./LoaderSpinner";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import StatBox from './ui/stat-box';

const NPCDetail = ({
  npcName,
  npcDescription,
  author,
  imageUrl,
  npcId,
  imageStorageId,
  isOwner,
  authorImageUrl,
  authorId,
  armorClass,
  hitPoints,
  challenge,
  proficiencyBonus,
  str,
  dex,
  con,
  int,
  wis,
  cha,
}: NPCDetailProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      await api.npcs.deleteNPC({ npcId, imageStorageId });
      toast({
        title: "NPC deleted",
      });
      router.push("/");
    } catch (error) {
      console.error("Error deleting NPC", error);
      toast({
        title: "Error deleting NPC",
        variant: "destructive",
      });
    }
  };

  if (!imageUrl || !authorImageUrl) return <LoaderSpinner />;

  const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

  return (
    <div className="mt-6 flex w-full flex-col md:flex-row">
      <div className="flex-shrink-0 self-center md:self-start">
        <Image
          src={imageUrl}
          width={250}
          height={250}
          alt="NPC image"
          className="rounded-lg"
          crossOrigin="anonymous"
        />
      </div>
      <div className="flex flex-col flex-grow justify-between md:pl-4 mt-4 md:mt-0">
        <div className="flex justify-between items-start flex-col md:flex-row">
          <div className="mb-4 md:mb-0">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1 max-w-60">
              {npcName}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                router.push(`/profile/${authorId}`);
              }}
            >
              <Image
                src={authorImageUrl}
                width={30}
                height={30}
                alt="Author icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{author}</h2>
            </figure>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <StatBox label="AC" value={armorClass} />
            <StatBox label="HP" value={hitPoints} />
            <StatBox label="CR" value={challenge} />
            <StatBox label="PB" value={`+${proficiencyBonus}`} />
          </div>
          {isOwner && (
            <div className="relative mt-2 md:mt-0 md:ml-4">
              <Image
                src="/icons/three-dots.svg"
                width={20}
                height={30}
                alt="Three dots icon"
                className="cursor-pointer"
                onClick={() => setIsDeleting((prev) => !prev)}
              />
              {isDeleting && (
                <div
                  className="absolute right-0 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2"
                  onClick={handleDelete}
                >
                  <Image
                    src="/icons/delete.svg"
                    width={16}
                    height={16}
                    alt="Delete icon"
                  />
                  <h2 className="text-16 font-normal text-white-1">Delete</h2>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <StatBox label="STR" value={str} modifier={calculateModifier(str)} />
          <StatBox label="DEX" value={dex} modifier={calculateModifier(dex)} />
          <StatBox label="CON" value={con} modifier={calculateModifier(con)} />
          <StatBox label="INT" value={int} modifier={calculateModifier(int)} />
          <StatBox label="WIS" value={wis} modifier={calculateModifier(wis)} />
          <StatBox label="CHA" value={cha} modifier={calculateModifier(cha)} />
        </div>
      </div>
    </div>
  );
};

export default NPCDetail;
