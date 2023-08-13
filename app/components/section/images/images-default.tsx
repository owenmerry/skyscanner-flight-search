import { useState } from "react";

interface ImagesDefaultProps {
  images: string[];
}

export const ImagesDefault = ({ images }: ImagesDefaultProps) => {
  const [imageNumber, setImageNumber] = useState(0);
  return (
    <div className="relative py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
      <div>
        <h2 className="mb-8 text-2xl font-bold tracking-tight leading-none text-gray-800 md:text-2xl lg:text-3xl dark:text-white">
          Images
        </h2>
      </div>
      <div>
        <div
          style={{ backgroundImage: `url(${images[imageNumber]}&w=1000)` }}
          className={`h-[300px] mb-2 bg-no-repeat bg-contain bg-center sm:h-[600px]`}
        ></div>
      </div>
      <div className="grid gap-2 sm:grid-cols-5 grid-cols-3">
        {images.map((image, key) => {
          return (
            <div className="">
              <div
                key={image}
                style={{ backgroundImage: `url(${image}&w=250)` }}
                className={`h-[120px] bg-cover cursor-pointer hover:opacity-70`}
                onClick={() => setImageNumber(key)}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
