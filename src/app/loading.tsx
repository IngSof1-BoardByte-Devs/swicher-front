import Image from 'next/image';
import icon from '@public/switcher.webp';

export default function LoadingComponent() {
    return (
        <main className="w-full h-dvh flex justify-center items-center flex-col">
            <div className="flex rounded-full w-[160px] h-[160px] overflow-hidden">
                <Image
                    src={icon}
                    width={300}
                    height={300}
                    priority={true}
                    alt="loading"
                    className="animate-pulse"
                ></Image>
            </div>
            <p className="p-4 text-2xl uppercase">Cargando</p>
        </main>
    );
}
