"use client";

import create_game from '@/lib/game';
import React, { useState } from 'react';

function FormCrearPartida() {
    const [formData, setFormData] = useState({ player_name: '', game_name: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    const create = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.game_name === '' || formData.player_name === '') {
            setErrorMessage('All fields are required');
            return;}
        if (
            !alphanumericRegex.test(formData.game_name) ||
            !alphanumericRegex.test(formData.player_name)) {
            setErrorMessage("Solo se permiten caracteres alfanuméricos");
            return;
        }else{
            setErrorMessage('');
            const result = await create_game({ 
                player_name: formData.player_name, game_name: formData.game_name });
                if (result.status === "ERROR") {
                    setErrorMessage(result.message);
                }
        } 
    }

    return (
        <form onSubmit= {() => {create}}>
            <div className="w-full h-dvh flex gap-4 justify-center items-center flex-col ">
                <div className="text-xl m-3 ">Crear partida</div>

                {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                <label htmlFor='player_name' className="block text-white mb-2">
                    Nombre de usuario
                    </label>
                <input 
                    className='rounded border-2  border-black  text-black dark:bg-slate-300 w-1/3 sm:w-auto'
                    type="text" 
                    id="player_name"
                    value={formData.player_name}
                    onChange={(e) => setFormData({ ...formData, player_name: e.target.value })}
                    required 
                    autoComplete='off'
                />

                <label htmlFor='game_name' className="block text-white mb-2">
                    Nombre de la partida
                    </label>
                <input 
                    className='rounded border-2  border-black text-black dark:bg-slate-300 w-1/3 sm:w-auto'
                    type="text" 
                    id="game_name"
                    value={formData.game_name}
                    onChange={(e) => setFormData({ ...formData, game_name: e.target.value })}
                    required 
                    autoComplete='off'
                />

                <button type="submit" className='bg-blue-500 hover:bg-blue-600 rounded-full p-2'>
                    Crear partida
                    </button>
            </div>
        </form>
    );
}
export default FormCrearPartida;