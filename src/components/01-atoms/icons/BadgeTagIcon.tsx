export enum BadgeStatus {
  DEFAULT = "Default",
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  REJECTED = "Rejected",
}

export const BadgeTagIcon = ({ status }: { status: BadgeStatus }) => {
  const Badge: Record<BadgeStatus, React.ReactNode> = {
    [BadgeStatus.DEFAULT]: (
      <div className="bg-red-500/10 p-2 rounded-full justify-center items-center inline-flex text-red-500 text-xs font-medium  uppercase leading-[13.20px] tracking-wide">
        {BadgeStatus.DEFAULT}
      </div>
    ),
    [BadgeStatus.CONFIRMED]: (
      <div className="bg-lime-400/10 p-2 rounded-full justify-center items-center inline-flex text-lime-400 text-xs font-medium  uppercase leading-[13.20px] tracking-wide">
        {BadgeStatus.CONFIRMED}
      </div>
    ),
    [BadgeStatus.PENDING]: (
      <div className="bg-yellow-500/10 p-2 rounded-full justify-center items-center inline-flex text-yellow-500 text-xs font-medium  uppercase leading-[13.20px] tracking-wide">
        {BadgeStatus.PENDING}
      </div>
    ),
    [BadgeStatus.REJECTED]: (
      <div className="bg-red-500/10 p-2 rounded-full justify-center items-center inline-flex text-red-500 text-xs font-medium  uppercase leading-[13.20px] tracking-wide">
        {BadgeStatus.REJECTED}
      </div>
    ),
  };

  return (
    <div className="shadow-tag p-semibold-dark flex items-center">
      {Badge[status]}
    </div>
  );
};
