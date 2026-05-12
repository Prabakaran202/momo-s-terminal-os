type Props = { title: string; description?: string };

export function ProductCard({ title, description }: Props) {
  return (
    <div className="rounded border border-border/60 bg-card/40 p-4">
      <div className="text-terminal-cyan">{title}</div>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

export default ProductCard;
