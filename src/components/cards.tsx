import Image from "next/image";
import card0 from "@public/test.jpg"

export function Card({ link }: { link: string }) {
    const cardPic = (link === "c0" ? card0 : card0); ; 
    return (
        <div className="p-1 bg-gray-600 rounded-lg shadow-sm w-full h-full">
            <div className="flex flex-col items-center h-full relative">
                <Image src={cardPic} alt={link} className="absolute w-full rounded-lg h-full" />
            </div>
        </div>
    );

}