'use client';

import { SignedIn, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import api from '@/api';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import PaymentModal from './PaymentModal';
import { User } from '@/api/types';

const RightSidebar = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [topCreators, setTopCreators] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userPayload: User = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          imageUrl: user.imageUrl || '',
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          tokens: 0, // Default value; real value should be returned by the backend
        };

        const data = await api.users.getUser(userPayload);
        setUserData(data);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchTopCreators = async () => {
      const creators = await api.users.getTopUserByNPCCreationCount();
      setTopCreators(creators);
    };
    fetchTopCreators();
  }, []);

  const tokenAmount = userData?.tokens || 0;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className={cn('right_sidebar h-[calc(100vh-5px)]')}>
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3">
          <UserButton />
          <div className="flex w-full flex-col">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-16 truncate font-semibold text-white-1">
                {user?.firstName} {user?.lastName}
              </h1>
              <Image src="/icons/right-arrow.svg" alt="arrow" width={24} height={24} />
            </div>
          </div>
        </Link>
        <div className="flex items-center mt-2">
          <div className="flex items-center ml-8">
            <Image src="/icons/token.svg" alt="tokens" width={24} height={24} />
            <span className="ml-1 text-14 font-medium text-orange-1">{tokenAmount}</span>
          </div>
          <div className="flex items-center">
            <button onClick={openModal} className="invert ml-5">
              <Image src="/icons/cart.svg" alt="Buy More" width={20} height={20} />
            </button>
          </div>
        </div>
      </SignedIn>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Creators" />
        <div className="flex flex-col gap-6">
          {topCreators.slice(0, 3).map((creator) => (
            <div
              key={creator.clerkId}
              className="flex cursor-pointer justify-between"
              onClick={() => router.push(`/profile/${creator.clerkId}`)}
            >
              <figure className="flex items-center gap-2">
                <Image
                  src={creator.imageUrl || '/default-image.png'}
                  alt={creator.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">{creator.name}</h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-1">{creator.totalNPCs} NPCs</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {isModalOpen && (
        <PaymentModal open={isModalOpen} onClose={closeModal} userId={user?.id || ''} />
      )}
    </section>
  );
};

export default RightSidebar;
