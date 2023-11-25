import mongoose from "mongoose";
import p from "passport-local-mongoose";

const userschema = mongoose.Schema();


userschema.plugin(p);

export const userModel = mongoose.model("user", userschema);