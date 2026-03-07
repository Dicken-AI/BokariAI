const MessageBoxLoading = () => {
  return (
    <div className="flex flex-col gap-4 w-full lg:w-9/12 py-6 bokari-fade-in">
      {/* Title skeleton */}
      <div className="h-7 rounded-lg w-3/5 bokari-shimmer" />

      {/* Source cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bokari-shimmer" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col gap-2.5 pt-2">
        <div className="h-3 rounded-md w-full bokari-shimmer" />
        <div className="h-3 rounded-md w-11/12 bokari-shimmer" />
        <div className="h-3 rounded-md w-4/5 bokari-shimmer" />
        <div className="h-3 rounded-md w-9/12 bokari-shimmer" />
      </div>
    </div>
  );
};

export default MessageBoxLoading;
