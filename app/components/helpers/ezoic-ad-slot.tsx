type EzoicAdSlotProps = {
  id: number;
  className?: string;
};

export function EzoicAdSlot({ id, className }: EzoicAdSlotProps) {
  return (
    <div className={className}>
      <div id={`ezoic-pub-ad-placeholder-${id}`}></div>
    </div>
  );
}
