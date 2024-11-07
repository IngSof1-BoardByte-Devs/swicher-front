import { MovementCard, FigureCard } from '@/types/card';
// figure cards
import fig01 from '@public/figure-card/fig01.svg';
import fig02 from '@public/figure-card/fig02.svg';
import fig03 from '@public/figure-card/fig03.svg';
import fig04 from '@public/figure-card/fig04.svg';
import fig05 from '@public/figure-card/fig05.svg';
import fig06 from '@public/figure-card/fig06.svg';
import fig07 from '@public/figure-card/fig07.svg';
import fig08 from '@public/figure-card/fig08.svg';
import fig09 from '@public/figure-card/fig09.svg';
import fig10 from '@public/figure-card/fig10.svg';
import fig11 from '@public/figure-card/fig11.svg';
import fig12 from '@public/figure-card/fig12.svg';
import fig13 from '@public/figure-card/fig13.svg';
import fig14 from '@public/figure-card/fig14.svg';
import fig15 from '@public/figure-card/fig15.svg';
import fig16 from '@public/figure-card/fig16.svg';
import fig17 from '@public/figure-card/fig17.svg';
import fig18 from '@public/figure-card/fig18.svg';
// easy cards
import fige1 from '@public/figure-card/fige01.svg';
import fige2 from '@public/figure-card/fige02.svg';
import fige3 from '@public/figure-card/fige03.svg';
import fige4 from '@public/figure-card/fige04.svg';
import fige5 from '@public/figure-card/fige05.svg';
import fige6 from '@public/figure-card/fige06.svg';
import fige7 from '@public/figure-card/fige07.svg';

// import movement cards
import mov1 from '@public/movement-card/mov1.svg';
import mov2 from '@public/movement-card/mov2.svg';
import mov3 from '@public/movement-card/mov3.svg';
import mov4 from '@public/movement-card/mov4.svg';
import mov5 from '@public/movement-card/mov5.svg';
import mov6 from '@public/movement-card/mov6.svg';
import mov7 from '@public/movement-card/mov7.svg';
import { div } from 'framer-motion/client';
import Image from 'next/image';

// mapping
const figureCards = [
    fig01,
    fig02,
    fig03,
    fig04,
    fig05,
    fig06,
    fig07,
    fig08,
    fig09,
    fig10,
    fig11,
    fig12,
    fig13,
    fig14,
    fig15,
    fig16,
    fig17,
    fig18,
];
const movementCards = [mov1, mov2, mov3, mov4, mov5, mov6, mov7];

export function MovementCardComponent({ card }: { card: MovementCard }) {
    return (
        <Image
            src={movementCards[card.type_movement]}
            height={140}
            width={163}
            alt="movement card"
        />
    );
}

export function FigureCardComponent({ card }: { card: FigureCard }) {
    return (
        <Image
            src={figureCards[card.type_figure]}
            height={50}
            width={50}
            alt="movement card"
        />
    );
}
