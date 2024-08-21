// User types
export interface User {
    clerkId: string;
    email: string;
    imageUrl?: string;
    name: string;
    tokens: number;
  }
  
  export interface CreateUserPayload {
    clerkId: string;
    email: string;
    imageUrl?: string;
    name: string;
    tokens: number;
  }
  
  export interface UpdateUserPayload {
    clerkId: string;
    imageUrl?: string;
    email?: string;
    tokens: number;
  }
  
  // NPC types
  export interface NPC {
    id: number;
    npcName: string;
    npcDescription: string;
    armorClass: number;
    hitPoints: number;
    speed: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    skills?: string;
    senses?: string;
    languages?: string;
    challenge?: number;
    proficiencyBonus: number;
    specialTraits?: string;
    actions?: string;
    imageUrl?: string;
    imageStorageId?: number;
    author: string;
    authorId: string;
    authorImageUrl: string;
    views: number;
  }
  
  export interface CreateNPCPayload {
    npcName: string;
    npcDescription: string;
    armorClass: number;
    hitPoints: number;
    speed: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    skills?: string;
    senses?: string;
    languages?: string;
    challenge?: number;
    proficiencyBonus: number;
    specialTraits?: string;
    actions?: string;
    imageUrl?: string;
    imageStorageId?: number;
  }
  