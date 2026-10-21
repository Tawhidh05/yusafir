export default function PageHeader({ title, text, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="h-page">{title}</h1>
        {text && <p className="mt-1 text-mute">{text}</p>}
      </div>
      {action}
    </div>
  );
}
