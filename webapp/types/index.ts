import { Dispatch, SetStateAction } from "react";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<number | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface CarouselProps {
  fansLikeDetail: TopCreatorsProps[];
}

export interface TopCreatorsProps {
  id: number; 
  creationTime: number; // If this is from the database, it might be a date
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  npcs: {
    npcName: string;
    npcId: number;
  }[];
  totalNPCs: number;
}

export interface ProfileNPCProps {
  npcs: NPCProps[];
  viewers: number;
}

export interface ProfileCardProps {
  npcData: ProfileNPCProps;
  imageUrl: string;
  userFirstName: string;
}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
}

// Updated NPC-related interfaces
export interface NPCProps {
  id: number;
  creationTime: number; // If this is from the database, it might be a date
  imageUrl?: string;
  skills?: string;
  senses?: string;
  languages?: string;
  challenge?: number;
  armorClass?: number;
  hitPoints?: number;
  speed?: number;
  proficiencyBonus?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  specialTraits?: string;
  actions?: string;
  npcName: string;
  npcDescription: string;
  views: number;
  author: string;
  authorId: string;
  authorImageUrl: string;
  imageStorageId?: number;
}

export interface GenerateNPCProps {
  setNPCDetails: Dispatch<SetStateAction<NPCProps | null>>;
  npcDetails: NPCProps | null;
  inputPrompt: string;
  setInputPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export interface NPCCardProps {
  imgUrl: string;
  title: string;
  description: string;
  npcId: number;
}

export interface NPCDetailProps {
  npcName: string;
  npcDescription: string;
  author: string;
  imageUrl: string;
  npcId: number;
  imageStorageId?: number;
  isOwner: boolean;
  authorImageUrl: string;
  authorId: string;
  armorClass: number;
  hitPoints: number;
  challenge: number;
  proficiencyBonus: number;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}
