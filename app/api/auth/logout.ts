import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  res.setHeader("Set-Cookie", [
    serialize("next-auth.session-token", "", {
      path: "/",
      expires: new Date(0),
    }),
    serialize("__Secure-next-auth.session-token", "", {
      path: "/",
      expires: new Date(0),
      secure: true,
    }),
  ]);

  res.status(200).json({ message: "Logged out successfully" });
}