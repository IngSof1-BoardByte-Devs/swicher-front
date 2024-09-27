"use client";
import React from "react";
import clsx from "clsx";

export function Piece({ color, index, selectedPiece, setSelectedPiece }: { color: string, index: number, selectedPiece: number, setSelectedPiece: (index: number) => void }) {
  return (
    <button className="w-full" onClick={() => { setSelectedPiece(index) }}>
      <div
        data-testid="pieceElement"
        className={clsx(
          "h-full flex rounded-lg transition-all duration-200 border justify-center items-center text-white font-bold capitalize",
          {
            "bg-red-700/75 hover:bg-red-700 ": color === "red",
            "bg-green-700/75 hover:bg-green-700": color === "green",
            "bg-blue-700/75 hover:bg-blue-700": color === "blue",
            "bg-violet-700/75 hover:bg-violet-700": color === "violet",
            "scale-90 brightness-150 animate-pulse": selectedPiece === index,
          }
        )}
      >
        {color}
      </div>
    </button>
  );
}

export default Piece;