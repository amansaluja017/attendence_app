import mongoose from "mongoose";

const dataBaseURI = process.env.MONGODBURI!;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

export async function connectToDatabase() {

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        mongoose.connect(dataBaseURI, {
            autoIndex: true
        })
        .then(() => mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null;
    }

    return cached.conn;
}