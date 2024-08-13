import { Todo } from "@prisma/client";


export const updateTodo = async( id: string, complete: boolean ):Promise<Todo> => {
    const body = { complete };

    const todo = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

    return todo;
}


export const createTodo = async( description: string ):Promise<Todo> => {
    const body = { description };

    const todo = await fetch(`/api/todos`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

    return todo;
}


export const deleteCompleteTodo = async( ):Promise<Todo> => {
    const body = { complete: true };

    const todos = await fetch(`/api/todos`, {
        method: 'DELETE',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

    return todos;
}