import clsx from 'clsx';

export function PieceComponent({
    color,
    selected,
}: {
    color: number;
    selected: boolean;
}) {
    return (
        <div
            className={clsx(
                'w-full h-full relative cursor-pointer rounded-lg',
                {
                    'bg-violet-500/50': color === 0,
                    'bg-red-500': color === 1,
                    'bg-blue-500': color === 2,
                    'bg-green-500': color === 3,
                    'animate-pulse scale-105': selected,
                },
            )}
        >
            <div
                data-testid="piece-btn"
                className="rounded-lg bg-white/25 absolute top-1/2 left-1/2 w-2/3 h-2/3 transform -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    );
}
