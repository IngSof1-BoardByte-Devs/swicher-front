import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

// figures
import A from "@public/figure/A.svg";
import B from "@public/figure/B.svg";
import C from "@public/figure/C.svg";
import D from "@public/figure/D.svg";

const pieces: { [key: number]: StaticImageData } = {
  0: A,
  1: B,
  2: C,
  3: D,
};

// Variantes para la animación de piezas
const variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }, // Animación cuando reaparecen
  swap: { scale: [1, 0, 1], opacity: [1, 0, 1], transition: { duration: 0.5 } } // Animación de intercambio
};

export function Piece(
  { color, index, selectedPiece, setSelectedPiece, isSwapping, handleSwap }: 
  { color: number, index: number, selectedPiece: number | null, setSelectedPiece: (index: number) => void, isSwapping: boolean, handleSwap: (index: number) => void }) 
  {
  const piecePic = pieces[color] || A;

  // Controlar cuando se seleccionan dos piezas
  const handleClick = () => {
    if (!isSwapping) { // Solo permitir clics cuando no se esté en proceso de intercambio
      if (selectedPiece === null) {
        setSelectedPiece(index); // Seleccionar la primera pieza
      } else if (selectedPiece !== index) {
        handleSwap(index); // Seleccionar la segunda pieza y realizar el intercambio
      }
    }
  };

  return (
    <motion.div
      animate={isSwapping ? "swap" : "visible"}
      initial="visible"
      variants={variants}
      whileTap={{ scale: 0.9 }}
      className={clsx("w-full h-full cursor-pointer", {
        "ring-2 ring-yellow-500": selectedPiece === index,
      })}
      onClick={handleClick}
    >
      <Image quality={50} src={piecePic} alt={`Piece ${index}`} className="w-full h-full" />
    </motion.div>
  );
}
