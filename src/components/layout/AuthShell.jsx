import Card from '../ui/Card';

/** Centered form card used by Login and Register (matches the Figma auth screens). */
export default function AuthShell({ title, children, below }) {
  return (
    <div className="container-page flex justify-center py-10 sm:py-14">
      <div className="w-full max-w-xl">
        <Card className="p-6 sm:p-10">
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {children}
        </Card>
        {below}
      </div>
    </div>
  );
}
