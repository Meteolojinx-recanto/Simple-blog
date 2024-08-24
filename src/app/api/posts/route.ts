import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const handleError = (error: any, message: string, status = 500) => {
    console.error(message, error);
    return NextResponse.json({ error: message }, { status });
};

const getIdFromUrl = (request: Request): number | null => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    return id ? +id : null;
};

const saveImage = async (image: File | null): Promise<string | null> => {
    if (!image) return null;

    const uniqueFileName = `${image.name}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, uniqueFileName);

    await fs.mkdir(uploadDir, { recursive: true });
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    return `/uploads/${uniqueFileName}`;
};

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = getIdFromUrl(request);
    const search = url.searchParams.get('search') || '';

    try {
        if (id) {
            const post = await prisma.post.findUnique({ where: { id } });
            if (post) return NextResponse.json(post);
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        } else {
            const posts = search
                ? await prisma.post.findMany({
                      where: {
                          title: {
                              contains: search,
                              mode: 'insensitive',
                          },
                      },
                  })
                : await prisma.post.findMany();
            return NextResponse.json(posts);
        }
    } catch (error) {
        return handleError(error, 'Failed to fetch post(s)');
    }
}


export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const image = formData.get('image') as File | null;

        const imagePath = await saveImage(image);

        const post = await prisma.post.create({
            data: { title, content, image: imagePath },
        });

        return NextResponse.json(post);
    } catch (error) {
        return handleError(error, 'Failed to save post');
    }
}

export async function PATCH(request: Request) {
    const id = getIdFromUrl(request);
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const image = formData.get('image') as File | null;

        const imagePath = await saveImage(image);

        const updatedPost = await prisma.post.update({
            where: { id },
            data: { title, content, image: imagePath || null },
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        return handleError(error, 'Post not found or update failed', 404);
    }
}

export async function DELETE(request: Request) {
    const id = getIdFromUrl(request);
    if (!id) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    try {
        const deletedPost = await prisma.post.delete({
            where: { id },
        });
        return NextResponse.json(deletedPost);
    } catch (error) {
        return handleError(error, 'Post not found or delete failed', 404);
    }
}
