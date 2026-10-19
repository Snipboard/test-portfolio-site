interface XmbHeaderProps {
  name?: string;
  tagline?: string;
}

export function XmbHeader({ name = "AFFAN KHAN", tagline = "Software Engineer" }: XmbHeaderProps) {
  return (
    <header className="absolute left-[8%] right-[8%] top-[7%] z-30 select-none">
      <span className="text-2xl font-semibold tracking-tight text-white">{name}</span>
      <span className="mt-2 block text-sm text-white/45">{tagline}</span>
    </header>
  );
}
