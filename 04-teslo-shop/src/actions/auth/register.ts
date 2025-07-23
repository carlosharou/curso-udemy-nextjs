'use server';

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async( name: string, email: string, password: string ) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email.toLowerCase(),
                password: bcryptjs.hashSync(password)
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        return {
            ok: true,
            message: "Usuario creado",
            user: newUser
        }
    } catch (error) {
        return {
            ok: false,
            message: `No se pudo crear el usuario: ${error}`
        }
    }
}