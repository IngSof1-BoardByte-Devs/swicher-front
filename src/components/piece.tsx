"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

// figures
import A from "@public/figure/A.svg";
import B from "@public/figure/B.svg";
import C from "@public/figure/C.svg";
import D from "@public/figure/D.svg";
import clsx from "clsx";

const pieces: { [key: number]: StaticImageData } = {
  0: A,
  1: B,
  2: C,
  3: D,
};

export function Piece(
  { color, index, selectedPiece, setSelectedPiece }: 
  { color: number, index: number, selectedPiece: number, setSelectedPiece: (index: number) => void }) 
  {
  const piecePic = pieces[color] || A;
  return (
    <button className={clsx("w-full", {
      "scale-90" : selectedPiece === index,
    })} onClick={() => { setSelectedPiece(index) }}>
      <Image quality={50} src={piecePic} alt={"color"} className="w-full h-full" />
    </button>
  );
}