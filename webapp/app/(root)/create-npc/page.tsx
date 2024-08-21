"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, useFieldArray, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import GenerateNPC from "@/components/GenerateNPC";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useApiMutation } from "@/hooks/useApiMutation";
import api from '@/api'
import { useRouter } from "next/navigation";
import { NPCProps } from "@/types";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

// Define the schema for the form validation
const formSchema = z.object({
  npcName: z.string().min(2, "Name must be at least 2 characters"),
  npcDescription: z.string().min(2, "Description must be at least 2 characters"),
  challenge: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Challenge must be at least 0")),
  armorClass: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Armor Class must be at least 0")),
  hitPoints: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Hit Points must be at least 0")),
  speed: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Speed must be at least 0")),
  proficiencyBonus: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Proficiency Bonus must be at least 0")),
  str: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Strength must be at least 0")),
  dex: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Dexterity must be at least 0")),
  con: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Constitution must be at least 0")),
  int: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Intelligence must be at least 0")),
  wis: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Wisdom must be at least 0")),
  cha: z.preprocess((val) => (val === "" ? undefined : parseInt(val as string, 10)), z.number().min(0, "Charisma must be at least 0")),
  skills: z.preprocess((val) => JSON.stringify(val), z.string().optional()),
  senses: z.preprocess((val) => JSON.stringify(val), z.string().optional()),
  languages: z.preprocess((val) => JSON.stringify(val), z.string().optional()),
  specialTraits: z.preprocess((val) => JSON.stringify(val), z.string().optional()),
  actions: z.preprocess((val) => JSON.stringify(val), z.string().optional()),
});

const formFields = [
  { name: "armorClass", label: "Armor Class", type: "number" },
  { name: "hitPoints", label: "Hit Points", type: "number" },
  { name: "speed", label: "Speed", type: "number" },
  { name: "proficiencyBonus", label: "Proficiency Bonus", type: "number" },
  { name: "str", label: "Strength", type: "number" },
  { name: "dex", label: "Dexterity", type: "number" },
  { name: "con", label: "Constitution", type: "number" },
  { name: "int", label: "Intelligence", type: "number" },
  { name: "wis", label: "Wisdom", type: "number" },
  { name: "cha", label: "Charisma", type: "number" },
];

// Define the props for the InputArray component
interface InputArrayProps {
  name: string;
  label: string;
  placeholderName: string;
  placeholderValue?: string;
}

// Input array component
const InputArray: React.FC<InputArrayProps> = ({ name, label, placeholderName, placeholderValue }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState("");

  const handleAdd = () => {
    if (newItemName && (!placeholderValue || newItemValue)) {
      const newItem = placeholderValue ? { name: newItemName, description: newItemValue } : { name: newItemName };
      append(newItem);
      setNewItemName("");
      setNewItemValue("");
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <FormLabel className="font-bold text-white-1" htmlFor={name}>{label}</FormLabel>
      {fields.map((item, index) => (
        <div key={item.id} className="flex gap-2.5 items-center">
          <Controller
            control={control}
            name={`${name}.${index}.name`}
            render={({ field }) => (
              <FormItem className={placeholderValue ? "flex-[0_0_25%] flex flex-col gap-2.5  text-white-1" : "flex-[0_0_81%] flex flex-col gap-2.5  text-white-1"}>
                <FormControl>
                  <Input
                    id={`${name}.${index}.name`}
                    className="bg-black-3 border-black-1 text-white-1 focus-visible:ring-offset-orange-1"
                    placeholder={placeholderName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white-1" />
              </FormItem>
            )}
          />
          {placeholderValue && (
            <Controller
              control={control}
              name={`${name}.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 flex-[0_0_55%] text-white-5">
                  <FormControl>
                    <Input
                      id={`${name}.${index}.description`}
                      className="bg-black-3 border-black-1 focus-visible:ring-offset-orange-1"
                      placeholder={placeholderValue}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          )}
          <Button
            type="button"
            className="text-16 bg-orange-1 py-2 px-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1 flex-[0_0_15%]"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <div className="flex gap-2.5 items-center">
        <FormItem className={placeholderValue ? "flex-[0_0_25%]" : "flex-[0_0_81%]"}>
          <FormControl>
            <Input
              className="input-class focus-visible:ring-offset-orange-1"
              placeholder={placeholderName}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </FormControl>
        </FormItem>
        {placeholderValue && (
          <FormItem className="flex-[0_0_55%]">
            <FormControl>
              <Input
                className="input-class focus-visible:ring-offset-orange-1"
                placeholder={placeholderValue}
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
              />
            </FormControl>
          </FormItem>
        )}
        <Button
          type="button"
          className="text-16 bg-orange-1 py-2 px-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1 flex-[0_0_15%]"
          onClick={handleAdd}
        >
          Add {label}
        </Button>
      </div>
    </div>
  );
};

// Main form component
const CreateNPC = () => {
  const router = useRouter();
  const { user } = useUser();
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStorageId, setImageStorageId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [npcDetails, setNPCDetails] = useState<NPCProps | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");

  const { mutate: createNPC } = useApiMutation(api.npcs.createNPC);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      npcName: "",
      npcDescription: "",
      challenge: 0,
      armorClass: 0,
      hitPoints: 0,
      speed: 0,
      proficiencyBonus: 0,
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log('submit reached');
    try {
      console.log('submitting with', data, " and ", imageUrl);
      setIsSubmitting(true);
      if (!data.npcName || !data.npcDescription || data.challenge === undefined || !imageUrl) {
        toast({
          title: 'Please fill all required fields and generate an image for the NPC',
        });
        setIsSubmitting(false);
        throw new Error('Please fill all required fields and generate an image for the NPC');
      }

      await createNPC({
        ...data,
        clerkId: user?.id,
        skills: JSON.stringify(data.skills),
        senses: JSON.stringify(data.senses),
        languages: JSON.stringify(data.languages),
        specialTraits: JSON.stringify(data.specialTraits),
        actions: JSON.stringify(data.actions),
        imageUrl,
        imageStorageId: imageStorageId!,
        views: 0,
      });
      toast({ title: 'NPC created' });
      setIsSubmitting(false);
      router.push('/');
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create NPC</h1>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col gap-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex flex-col items-center gap-5">
              <GenerateThumbnail
                setImage={setImageUrl}
                setImageStorageId={setImageStorageId}
                image={imageUrl}
                imagePrompt={imagePrompt}
                setImagePrompt={setImagePrompt}
              />
            </div>
            <div className="flex flex-col w-full gap-5">
              <div className="flex flex-col md:flex-row gap-5">
                <FormField
                  control={form.control}
                  name="npcName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5 flex-grow">
                      <FormLabel className="text-16 font-bold text-white-1" htmlFor="npcName">Name</FormLabel>
                      <FormControl>
                        <Input id="npcName" className="input-class focus-visible:ring-offset-orange-1" placeholder="Enter NPC Name" {...field} />
                      </FormControl>
                      <FormMessage className="text-white-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="challenge"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5">
                      <FormLabel className="text-16 font-bold text-white-1" htmlFor="challenge">Challenge Rating (CR)</FormLabel>
                      <FormControl>
                        <Input id="challenge" type="number" className="input-class focus-visible:ring-offset-orange-1" placeholder="Enter Challenge Rating" {...field} />
                      </FormControl>
                      <FormMessage className="text-white-1" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="npcDescription"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5 w-full">
                    <FormLabel className="text-16 font-bold text-white-1" htmlFor="npcDescription">Description</FormLabel>
                    <FormControl>
                      <Textarea id="npcDescription" className="input-class focus-visible:ring-offset-orange-1" rows={5} placeholder="Write a short NPC description" {...field} />
                    </FormControl>
                    <FormMessage className="text-white-1" />
                  </FormItem>
                )}
              />
              <GenerateNPC
                setNPCDetails={setNPCDetails}
                npcDetails={npcDetails}
                inputPrompt={inputPrompt}
                setInputPrompt={setInputPrompt}
                formData={form.getValues()}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {formFields.map((fieldConfig) => (
              <FormField
                key={fieldConfig.name}
                control={form.control}
                name={fieldConfig.name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2.5 flex-grow">
                    <FormLabel className="text-16 font-bold text-white-1" htmlFor={fieldConfig.name}>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      <Input
                        id={fieldConfig.name}
                        type={fieldConfig.type}
                        className="input-class focus-visible:ring-offset-orange-1"
                        placeholder={`Enter ${fieldConfig.label}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-white-1" />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <InputArray
            name="skills"
            label="Skills"
            placeholderName="Skill Name"
            placeholderValue="Skill Description"
          />
          <InputArray
            name="senses"
            label="Senses"
            placeholderName="Sense Name"
            placeholderValue="Sense Description"
          />
          <InputArray
            name="languages"
            label="Languages"
            placeholderName="Language"
          />
          <InputArray
            name="specialTraits"
            label="Special Traits"
            placeholderName="Trait Name"
            placeholderValue="Trait Description"
          />
          <InputArray
            name="actions"
            label="Actions"
            placeholderName="Action Name"
            placeholderValue="Action Description"
          />
          <div className="mt-10 w-full">
            <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
              {isSubmitting ? (
                <>
                  Submitting
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                'Submit & Create NPC'
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}

export default CreateNPC;