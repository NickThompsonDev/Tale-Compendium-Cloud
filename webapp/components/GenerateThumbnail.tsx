import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { GenerateThumbnailProps } from '@/types';
import { Loader } from 'lucide-react';
import { Input } from './ui/input';
import Image from 'next/image';
import { useToast } from './ui/use-toast';
import api from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';
import { useUser } from '@clerk/clerk-react';

const GenerateThumbnail = ({ setImage, setImageStorageId, image, imagePrompt, setImagePrompt }: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const handleImage = async (blob: Blob, fileName: string) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const fileTypeResult = await fileTypeFromBuffer(new Uint8Array(arrayBuffer));

      if (!fileTypeResult) {
        throw new Error('Could not determine file type');
      }

      const { mime, ext } = fileTypeResult;

      // Remove any existing extension from the file name
      const cleanFileName = fileName.replace(/\.[^/.]+$/, "");

      const file = new File([blob], `${cleanFileName}.${ext}`, { type: mime });
      console.log('Detected MIME type:', mime);

      const uploaded = await api.files.uploadFile(file);
      console.log('uploadedresponse', uploaded);
      const storageId = uploaded.id;

      setImageStorageId(storageId);

      const imageUrl = await api.files.getImageUrl(storageId);
      setImage(imageUrl);
      console.log('image', imageUrl);
      setIsImageLoading(false);
      toast({
        title: "Thumbnail generated successfully",
      });
    } catch (error) {
      console.log(error);
      toast({ title: 'Error generating thumbnail', variant: 'destructive' });
      setIsImageLoading(false);
    }
  };



  const generateImage = async () => {
    setIsImageLoading(true);
    try {
      if (!user) throw new Error('User not authenticated');
      await api.users.consumeTokens({ clerkId: user.id, tokens: 2 });
      const response = await api.openai.generateThumbnail(imagePrompt);
      const mimeType = response.headers['content-type'];
      const blob = new Blob([response], { type: mimeType });
      await handleImage(blob, `thumbnail-${uuidv4()}`);
    } catch (error) {
      console.log(error);
      toast({ title: 'Error generating thumbnail', variant: 'destructive' });
      setIsImageLoading(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      await handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({ title: 'Error uploading image', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {isAiThumbnail ? (
        <div className="flex flex-col items-start gap-5">
          <Textarea
            className="input-class font-light focus-visible:ring-offset-orange-1 w-[250px] h-[250px]"
            placeholder='Provide text to generate thumbnail'
            rows={5}
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
          />
          <div className="w-full">
            <Button type="button" className="text-16 bg-orange-1 py-4 font-bold text-white-1 w-full" onClick={generateImage}>
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                <>
                  Generate
                  <Image src="/icons/token.svg" alt={"Token"} width={20} height={20} className={"ml-2"} />
                  2
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="image_div flex flex-col items-center gap-2" onClick={() => imageRef?.current?.click()}>
            <Input
              type="file"
              className="hidden"
              ref={imageRef}
              onChange={(e) => uploadImage(e)}
            />
            {!isImageLoading ? (
              <Image src="/icons/upload-image.svg" width={40} height={40} alt="upload" />
            ) : (
              <div className="text-16 flex-center font-medium text-white-1">
                Uploading
                <Loader size={20} className="animate-spin ml-2" />
              </div>
            )}
            <div className="flex flex-col items-center gap-1 ">
              <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
              <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF</p>
              <p className="text-12 font-normal text-gray-1">(max. 1080x1080px)</p>
            </div>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={250}
            height={250}
            className="mt-5"
            alt="thumbnail"
            crossOrigin="anonymous"
          />
        </div>
      )}
      <div className="flex flex-col flex-center items-center">
        <Button
          type="button"
          onClick={() => setIsAiThumbnail(!isAiThumbnail)}
          className="text-16 bg-orange-1 py-4 font-bold text-white-1 w-full"
        >
          {isAiThumbnail ? 'Upload custom image' : 'Use AI to generate thumbnail'}
        </Button>
      </div>
    </div>
  );
}

export default GenerateThumbnail;
