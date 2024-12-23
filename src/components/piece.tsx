import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { verify } from "crypto";



const variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }, // Animación cuando reaparecen
  swap: { scale: [1, 0, 1], opacity: [1, 0, 1], transition: { duration: 0.5 } } // Animación de intercambio
};

export function Piece(
  { color, index, selectedPiece, setSelectedPiece, isSwapping, isMoveCardSelected, isFigCardSelected, cardSelected, selectedTurn, playerTurn, verifyMovement, verifyFigure, selected, setSelected }: 
  { color: number, index: number, selectedPiece: number | null, setSelectedPiece: (index: number | null ) => void, 
    isSwapping: boolean, verifyMovement: (cardSelected: string , selectedPiece: number, index: number) => void, isMoveCardSelected: boolean, cardSelected: string,
    selectedTurn: number, playerTurn: number, selected: boolean, setSelected: (id: number | undefined) => void, isFigCardSelected: boolean,
    verifyFigure: (index: number, card: string, blockedColor: number) => void }  
) 
{
 

  

  const handleClick = () => {
    if (!isMoveCardSelected) {
      setSelected(selected ? undefined : index)
      if (isFigCardSelected) {
        console.log("figCardSelected", cardSelected);
        verifyFigure(index, cardSelected, color);
      }
    }else if (isMoveCardSelected) {
      if (playerTurn !== selectedTurn) {
        alert("No es tu turno");
        return;
      }else if (!isSwapping) {
            if (selectedPiece === null) {
              setSelectedPiece(index); 
            } else if (selectedPiece !== index) {
              verifyMovement(cardSelected, selectedPiece, index);
            }
        }
    }
  };

  return (
    <motion.div role="piece" 
    animate={isSwapping ? "swap" : "visible"}
      initial="visible"
      variants={variants}
      whileTap={{ scale: 0.9 }}
    className={clsx("w-full h-full relative cursor-pointer rounded-lg", {
      "bg-violet-500/50": color === 0,
      "bg-red-500": color === 1,
      "bg-blue-500": color === 2,
      "bg-green-500": color === 3,
      "animate-pulse": selected,
    })} >
      <button
        data-testid="piece-btn"
        onClick={handleClick}
        className="rounded-lg bg-white/25 absolute top-1/2 left-1/2 w-2/3 h-2/3 transform -translate-x-1/2 -translate-y-1/2"
      />
    </motion.div>
  );
}
