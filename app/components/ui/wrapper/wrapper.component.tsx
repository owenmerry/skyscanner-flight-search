interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <div className={`mx-auto max-w-screen-xl lg:px-12 px-4 py-4 ${className} `}>
      {children}
    </div>
  );
};
