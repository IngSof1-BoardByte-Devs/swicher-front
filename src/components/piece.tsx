"use client";
import React from 'react';

export function Piece ({ color } : {color: string}){
  return (
    <div
      data-testid="pieceElement"
      className={`w-full h-dvh flex rounded-lg transition-all duration-200 hover:scale-110`}
      style={{ backgroundColor: color }}
    />
  );
};

export default Piece;