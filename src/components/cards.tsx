import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// figure cards
import fig01 from "@public/figure-card/fig01.svg";
import fig02 from "@public/figure-card/fig02.svg";
import fig03 from "@public/figure-card/fig03.svg";
import fig04 from "@public/figure-card/fig04.svg";
import fig05 from "@public/figure-card/fig05.svg";
import fig06 from "@public/figure-card/fig06.svg";
import fig07 from "@public/figure-card/fig07.svg";
import fig08 from "@public/figure-card/fig08.svg";
import fig09 from "@public/figure-card/fig09.svg";
import fig10 from "@public/figure-card/fig10.svg";
import fig11 from "@public/figure-card/fig11.svg";
import fig12 from "@public/figure-card/fig12.svg";
import fig13 from "@public/figure-card/fig13.svg";
import fig14 from "@public/figure-card/fig14.svg";
import fig15 from "@public/figure-card/fig15.svg";
import fig16 from "@public/figure-card/fig16.svg";
import fig17 from "@public/figure-card/fig17.svg";
import fig18 from "@public/figure-card/fig18.svg";
// easy cards
import fige1 from "@public/figure-card/fige01.svg";
import fige2 from "@public/figure-card/fige02.svg";
import fige3 from "@public/figure-card/fige03.svg";
import fige4 from "@public/figure-card/fige04.svg";
import fige5 from "@public/figure-card/fige05.svg";
import fige6 from "@public/figure-card/fige06.svg";
import fige7 from "@public/figure-card/fige07.svg";

// import movement cards
import mov1 from "@public/movement-card/mov1.svg";
import mov2 from "@public/movement-card/mov2.svg";
import mov3 from "@public/movement-card/mov3.svg";
import mov4 from "@public/movement-card/mov4.svg";
import mov5 from "@public/movement-card/mov5.svg";
import mov6 from "@public/movement-card/mov6.svg";
import mov7 from "@public/movement-card/mov7.svg";

// mapping
const figureCards: { [key: string]: string } = {
  fig01: fig01,
  fig02: fig02,
  fig03: fig03,
  fig04: fig04,
  fig05: fig05,
  fig06: fig06,
  fig07: fig07,
  fig08: fig08,
  fig09: fig09,
  fig10: fig10,
  fig11: fig11,
  fig12: fig12,
  fig13: fig13,
  fig14: fig14,
  fig15: fig15,
  fig16: fig16,
  fig17: fig17,
  fig18: fig18,
  fige1: fige1,
  fige2: fige2,
  fige3: fige3,
  fige4: fige4,
  fige5: fige5,
  fige6: fige6,
  fige7: fige7,
};
const movementCards: { [key: string]: string } = {
  mov1: mov1,
  mov2: mov2,
  mov3: mov3,
  mov4: mov4,
  mov5: mov5,
  mov6: mov6,
  mov7: mov7,
};

export function Card({ type, index, id, selectedCard, setSelectedCard, isSelectable, setMoveCard, usedCard }:
 { type: boolean; index: number; id: string; selectedCard: string | null; setSelectedCard: (id: string | null) => void;
   isSelectable: boolean; setMoveCard: (id: string) => void; usedCard: boolean; }) {
  let cardPic;
  if (!type) {
    cardPic = movementCards[`mov${index}`];
  } else if (index <= 9) {
    cardPic = figureCards[`fig0${index}`];
  } else if (index <= 18) {
    cardPic = figureCards[`fig${index}`];
  } else {
    cardPic = figureCards[`fige${index - 18}`];
  }

  return (
    <AnimatePresence>
      <motion.div
        className="w-full h-full bg-gray-100 rounded-[35px] shadow-lg relative"
        layout
        onClick={() => {
          if (selectedCard === id) {
            setSelectedCard(null);
            setMoveCard("");
          } else {
            setSelectedCard(id);
            if (!type) { 
              setMoveCard(`mov${index}`)
            }
          }
        }}
        whileTap={{ scale: 0.8 }}
        animate={{
          scale: (selectedCard === id) && isSelectable ? 1.3 : 1,
          opacity: usedCard ? 0.3 : 1,
        }}
        style={{
          position: type ? "static" : "relative",
          cursor: !type ? "pointer" : "default",
        }}
      >
        <div className="relative flex flex-col h-full items-center pointer-events-none">
          <Image
            quality={50}
            src={cardPic}
            alt={"carta"}
            className="absolute w-full h-full"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

