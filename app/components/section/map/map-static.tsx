interface MapStaticProps {
  imageUrl: string;
  altText: string;
  onShowMap: () => void;
}

export const MapStatic: React.FC<MapStaticProps> = ({ imageUrl, altText, onShowMap }) => {
  return (
    <div className="relative">
      <img
        alt={altText}
        src={imageUrl}
        className="w-full"
      />
      <button
        className="absolute top-2 right-2 cursor-pointer text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700"
        onClick={onShowMap}
      >
        Show Map
      </button>
    </div>
  );
};