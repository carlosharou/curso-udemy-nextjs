import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { NextResponse } from "next/server";
import * as yup from "yup";


interface Segments {
    params: {
        id: string;
    }
}


const getTodo = async( id: string ): Promise<Todo | null> => {
    const todo = await prisma.todo.findUnique({
        where: {
            id
        }
    });

    return todo;
}


export async function GET(request: Request, { params }: Segments) {
    const todo = await getTodo(params.id);


    if (!todo) {
        return NextResponse.json({
            message: `Todo con id [${params.id}], no encontrado`
        }, {
            status: 400
        });
    }


    return NextResponse.json({
        data: todo
    });
}


const putSchema = yup.object({
    description: yup.string().optional(),
    complete: yup.boolean().optional()
});

export async function PUT(request: Request, { params }: Segments) {
    const todo = await getTodo(params.id);


    if (!todo) {
        return NextResponse.json({
            message: `Todo con id [${params.id}], no encontrado`
        }, {
            status: 400
        });
    }


    try {
        const { description, complete } = await putSchema.validate(await request.json());

        const todo = await prisma.todo.update({
            where: {
                id: params.id
            }, data: {
                description,
                complete
            }
        })

        return NextResponse.json(todo);
    } catch(error) {
        return NextResponse.json(error, { status: 400 });
    }
}


export async function DELETE(request: Request, { params }: Segments) {
    const todo = await getTodo(params.id);

    if (!todo) {
        return NextResponse.json({
            message: `Todo con id [${params.id}], no encontrado`
        }, {
            status: 400
        });
    }

    try {
        const todo = await prisma.todo.delete({
            where: {
                id: params.id
            }
        });

        return NextResponse.json(todo);
    } catch(error) {
        return NextResponse.json(error, { status: 400 });
    }
}