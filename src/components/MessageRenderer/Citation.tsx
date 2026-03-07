const Citation = ({
  href,
  title,
  children,
}: {
  href: string;
  title?: string;
  children: React.ReactNode;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title || href}
      className="inline-flex items-center justify-center bg-bokari-500/8 hover:bg-bokari-500/14 px-1.5 py-0.5 rounded-md mx-0.5 no-underline text-[10px] font-semibold text-bokari-600 dark:text-bokari-400 transition-colors duration-150 align-middle min-w-[18px] tabular-nums"
    >
      {children}
    </a>
  );
};

export default Citation;
