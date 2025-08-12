import { NextResponse } from 'next/server';

import User from '@/database/user.model';
import handleError from '@/lib/handlers/error';
import { ValidationError } from '@/lib/http-errors';
import dbConnect from '@/lib/mongoose';
import { UserSchema } from '@/lib/validations';
// @ts-expect-error not sure why this is needed, but it works
import { APIErrorResponse } from '@/types/global';

// Get all Users
export async function GET() {
  try {
    // Ensure the database connection is established
    await dbConnect();

    // Fetch all users from the database
    const users = await User.find();

    // Return a success response with the list of users
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    // Handle errors, including database errors
    return handleError(error, 'api') as APIErrorResponse;
  }
}

// Create User
export async function POST(request: Request) {
  try {
    // Ensure the database connection is established
    await dbConnect();

    // Get the request body
    const body = await request.json();

    // Validate the request body against the UserSchema
    const validatedData = UserSchema.safeParse(body);

    // If validation fails, throw a ValidationError with the flattened field errors
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    // Destructure the validated data to extract email and username
    const { email, username } = validatedData.data;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    // Check if a user with the same username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error('Username already exists');

    // Create a new user with the validated data
    const newUser = await User.create(validatedData.data);

    // Return a success response with the newly created user
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    // Handle errors, including validation errors and database errors
    return handleError(error, 'api') as APIErrorResponse;
  }
}
