"use client";
import clsx from "clsx";

export function Piece(
  { color, index, selectedPiece, setSelectedPiece }:
    { color: number, index: number, selectedPiece: number, setSelectedPiece: (index: number) => void }) {
  return (
    <div className={clsx("w-full h-full p-1 rounded", {
      "bg-violet-500/50": color === 0,
      "bg-red-500/50": color === 1,
      "bg-blue-500/50": color === 2,
      "bg-green-500/50": color === 3,
      "animate-pulse": selectedPiece === index,
    })} >
      <button
        onClick={() => { setSelectedPiece(index) }}
        className={clsx("w-full h-full border-8 rounded", {
          "bg-violet-500/50 border-violet-500": color === 0,
          "bg-red-500/50 border-red-500": color === 1,
          "bg-blue-500/50 border-blue-500": color === 2,
          "bg-green-500/50 border-green-500": color === 3,
        })}
      />
    </div>
  );
}