
import { connect } from "../../../dbConfig/dbConfig.mjs";
import User from "../../../models/userModel.mjs";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { username, password } = reqBody;
    console.log(reqBody);
    // checkif user exists
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User doesnt exist" }, { status: 400 });
    }
    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }
    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
    
    };
    //create token
    
const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
  expiresIn: "1d",
});
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
        console.error("login error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}
