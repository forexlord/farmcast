type ForecastPageHeaderProps = {
  title: string;
  subtitle: string;
};

export function ForecastPageHeader({ title, subtitle }: ForecastPageHeaderProps) {
  return (
    <section>
      <h1 className="text-headline-lg text-on-surface">{title}</h1>
      <p className="text-body-md text-on-surface-variant">{subtitle}</p>
    </section>
  );
}
