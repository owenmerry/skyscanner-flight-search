interface MarketingGalleryProps {
  images: string[];
}
export const MarketingGallery = ({ images }: MarketingGalleryProps) => {
  return (
    <div>
      <section className="">
        <div className="px-2 sm:px-4 mx-auto max-w-screen-xl lg:px-12 text-center">
          <div className="gap-4 mt-8 grid grid-cols-4">
            <img
              className="col-span-3 sm:col-span-2 mb-4 sm:mb-0 rounded-lg"
              src={`${images[0]}&w=800`}
              alt="content gallery 1"
              loading="lazy"
            />
            <img
              className="col-span-1 sm:block rounded-lg"
              src={`${images[1]}&w=800`}
              alt="content gallery 2"
              loading="lazy"
            />
            <img
              className="col-span-1 sm:block rounded-lg"
              src={`${images[2]}&w=500`}
              alt="content gallery 3"
              loading="lazy"
            />
            <img
              className="col-span-3 sm:col-span-1 sm:block rounded-lg"
              src={`${images[3]}&w=500`}
              alt="content gallery 4"
              loading="lazy"
            />
            <img
              className="col-span-3 sm:col-span-2 rounded-lg"
              src={`${images[4]}&w=800`}
              alt="content gallery 5"
              loading="lazy"
            />
            <img
              className="hidden col-span-1 sm:block rounded-lg"
              src={`${images[5]}&w=800`}
              alt="content gallery 6"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
