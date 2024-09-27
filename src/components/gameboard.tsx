"use client"
import React, { useState } from "react";
import Piece from "./piece";

import { fetch_board } from "@/lib/board";

function Gameboard() {
    const game_id = 1;
    const [selectedPiece, setSelectedPiece] = useState<number>(-1);
    //console.log(fetch_board({game_id}));

    return (
        <div role="grid" className="grid grid-cols-6 p-5 justify-items-center grid-rows-6 gap-1" style={{ aspectRatio: "1 / 1" }}>
            {Array.from({ length: 36 }, (_, i) => (
                <Piece color="red" index={i} selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} key={i} />
            ))}
        </div>
    )
}

export default Gameboard;