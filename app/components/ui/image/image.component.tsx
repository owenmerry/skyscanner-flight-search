import { useEffect, useState } from "react";
import { getImage } from "~/helpers/image";

interface ImageProps {
  entityId: string;
}

export const Image = ({ entityId }: ImageProps) => {
  const [img, setImg] = useState<string>('empty');

  const fetchImage = async () => {
    //const image = await getImage(entityId);
    //setImg(image);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <>
      <img src={img} alt="image" />
    </>
  );
}