export default function Avatar({ user, className = 'size-9' }) {
  if (user?.image) return <img src={user.image} alt="" className={`rounded-xl object-cover ${className}`} />;
  return (
    <span aria-hidden="true" className={`grid place-items-center rounded-xl bg-brand font-bold text-black ${className}`}>
      {user?.firstName?.[0]?.toUpperCase() ?? '?'}
    </span>
  );
}
