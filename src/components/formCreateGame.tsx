"use client";

import create_game from '@/lib/game';
import React, { useState } from 'react';


function FormCrearPartida() {

    const [formData, setFormData] = useState({ player_name: '', game_name: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    const create =(e: React.FormEvent) => {
        e.preventDefault();

        if (formData.game_name === '' || formData.player_name === '') {
            setErrorMessage('Todos los campos son obligatorios');
            return;}

        if (
            !alphanumericRegex.test(formData.game_name) ||
            !alphanumericRegex.test(formData.player_name)) {
            setErrorMessage("Solo se permiten caracteres alfanuméricos");
            return;
        }else{
            setErrorMessage('');
            send(formData);
        } 
    }
    const send = async (data: { player_name: string; game_name: string; }) => {
        const result = await create_game({ 
            player_name: formData.player_name, game_name: formData.game_name });
            if (result.status === "ERROR") {
                setErrorMessage(result.message);
            }
    }

    return (
        <form onSubmit={create}>
            <div className="w-full h-dvh flex gap-4 justify-center items-center flex-col ">
                <div className="text-xl m-3 ">Crear partida</div>

                <label htmlFor='player_name' className="block dark:text-white mb-2">
                    Nombre de usuario
                    </label>
                <input 
                    className='rounded border-2  border-black  text-black dark:bg-slate-300 w-1/3 sm:w-auto'
                    type="text" 
                    id="player_name"
                    name="player_name"
                    value={formData.player_name}
                    onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                     
                    autoComplete='off'
                />

                <label htmlFor='game_name' className="block dark:text-white mb-2">
                    Nombre de la partida
                    </label>
                <input 
                    className='rounded border-2  border-black text-black dark:bg-slate-300 w-1/3 sm:w-auto'
                    type="text" 
                    id="game_name"
                    value={formData.game_name}
                    onChange={(e) => setFormData({ ...formData, game_name: e.target.value })}
                     
                    autoComplete='off'
                />

                {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}

                <button type="submit" className='bg-grey-900  hover:bg-grey-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded p-2'>
                    Crear partida
                    </button>
            </div>
        </form>
    );
}
export default FormCrearPartida;