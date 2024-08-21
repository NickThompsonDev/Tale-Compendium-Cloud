import { GenerateNPCProps } from '@/types';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import api from '@/api';
import { useToast } from "@/components/ui/use-toast";
import { useFormContext } from 'react-hook-form';
import { NPCProps } from '@/types';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

const useGenerateNPC = ({
  setNPCDetails,
  formData,
}: GenerateNPCProps & { formData: any }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const generateNPC = async () => {
    setIsGenerating(true);
    setNPCDetails(null);

    if (!formData.npcName || !formData.challenge || !formData.npcDescription) {
      toast({
        title: "Please fill in Name, Challenge Rating, and Description to generate NPC details",
      });
      setIsGenerating(false);
      return;
    }

    try {
      if (!user) throw new Error('User not authenticated');
      await api.users.consumeTokens({ clerkId: user.id, tokens: 1 }); // Replacing useMutation with direct API call
      const response = await api.openai.generateNPCDetails({
        input: JSON.stringify(formData),
      });

      setNPCDetails(response);
      toast({
        title: "NPC details generated successfully",
      });
    } catch (error) {
      console.log('Error generating NPC details', error);
      toast({
        title: "Error generating NPC details",
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generateNPC };
};

const GenerateNPC = (props: GenerateNPCProps & { formData: any }) => {
  const { isGenerating, generateNPC } = useGenerateNPC(props);
  const { setValue, getValues } = useFormContext<NPCProps>();
  const [showDetails, setShowDetails] = useState(false);

  // Populate form fields with generated NPC details
  React.useEffect(() => {
    if (props.npcDetails) {
      Object.entries(props.npcDetails).forEach(([key, value]) => {
        setValue(key as keyof NPCProps, value);
      });
    }
  }, [props.npcDetails, setValue]);

  const handleGenerateNPC = () => {
    const currentFormValues = getValues();
    generateNPC();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Button type="button" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={handleGenerateNPC}>
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            <>
              Generate NPC Details
              <Image src="/icons/token.svg" alt={"Token"} width={20} height={20} className={"ml-2"} />
              1
            </>
          )}
        </Button>
        {props.npcDetails && (
          <Button
            type="button"
            className="text-16 bg-orange-1 py-4 font-bold text-white-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            Info
          </Button>
        )}
      </div>
      {showDetails && props.npcDetails && (
        <div className="mt-5">
          <h2 className="text-16 font-bold text-white-1">Generated NPC Details</h2>
          <pre className="text-white-1">{JSON.stringify(props.npcDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default GenerateNPC;
