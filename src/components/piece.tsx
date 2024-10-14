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


const variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }, // Animación cuando reaparecen
  swap: { scale: [1, 0, 1], opacity: [1, 0, 1], transition: { duration: 0.5 } } // Animación de intercambio
};

export function Piece(
  { color, index, selectedPiece, setSelectedPiece, isSwapping, handleSwap, isMoveCardSelected, cardSelected, selectedTurn, playerTurn }: 
  { color: number, index: number, selectedPiece: number | null, setSelectedPiece: (index: number | null ) => void, 
    isSwapping: boolean, handleSwap: (index: number) => void, isMoveCardSelected: boolean, cardSelected: string,
    selectedTurn: number, playerTurn: number }  
) 
{
  const piecePic = pieces[color] || A;

  const verifyMovement = (cardSelected: string, selectedPiece: number, index: number): boolean => {
    console.log("Card selected: ", cardSelected);
    console.log("primera pieza: ", selectedPiece);
    console.log("segunda pieza: ", index);
    return false;
  }

  const handleClick = () => {
    if (playerTurn !== selectedTurn) {
      alert("No es tu turno.");
      return;  
    }

    if (!isMoveCardSelected) {
      alert("No se ha seleccionado una carta de movimiento");
    } else {
      if (!isSwapping) {
        if (selectedPiece === null) {
          setSelectedPiece(index); 
        } else if (selectedPiece !== index) {
          if (verifyMovement(cardSelected, selectedPiece, index)) {
            handleSwap(index); 
          } else {
            alert("Las piezas no coinciden con el movimiento seleccionado");
            setSelectedPiece(null);
          }
        }
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
