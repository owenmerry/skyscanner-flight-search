interface MarketingGalleryProps {
  images: string[]
}
export const MarketingGallery = ({
  images
}: MarketingGalleryProps) => {
  return (
    <div>
      <section className="">
        <div className="px-4 mx-auto max-w-screen-xl lg:px-12 sm:text-center">
         
          <div className="gap-4 mt-8 grid grid-cols-4">
            <img
              className="col-span-2 mb-4 sm:mb-0 rounded-lg"
              src={images[0]}
              alt="content gallery 1"
            />
            <img
              className="col-span-1 sm:block rounded-lg"
              src={images[1]}
              alt="content gallery 2"
            />
            <img
              className="col-span-1 sm:block rounded-lg"
              src={images[2]}
              alt="content gallery 3"
            />
            <img
              className="col-span-1 sm:block rounded-lg"
              src={images[3]}
              alt="content gallery 4"
            />
            <img
              className="col-span-2 rounded-lg"
              src={images[4]}
              alt="content gallery 5"
            />
            <img
              className="hidden col-span-1 sm:block rounded-lg"
              src={images[5]}
              alt="content gallery 6"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
