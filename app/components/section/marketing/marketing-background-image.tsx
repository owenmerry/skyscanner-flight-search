interface MarketingBackgroundImageProps {
  image?: string;
}
export const MarketingBackgroundImage = ({
  image,
}: MarketingBackgroundImageProps) => {
  if (!image) return;
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-[60rem]">
        <img
          src={`${image}&w=1500`}
          srcSet={`${image}&w=1024 1024w, ${image}&w=768 768w, ${image}&w=480 480w`}
          alt="Country view"
          className="object-cover w-full h-full"
        />
        <div className="opacity-80 bg-slate-900 absolute top-0 left-0 w-[100%] h-[100%] z-0"></div>
        <div className="bg-gradient-to-t from-slate-900 to-transparent absolute bottom-0 left-0 w-[100%] h-[70%] z-0"></div>
      </div>
    </div>
  );
};
