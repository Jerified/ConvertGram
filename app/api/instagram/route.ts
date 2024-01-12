import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import axios from "axios";

// function fromBuffer(buffer: Buffer, options: { headers?: HeadersInit; status?: number } = {}) {
//     return NextResponse.from(Buffer.from(buffer), options)
// }

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();
  console.log(imageUrl);
  if (!imageUrl || !imageUrl.startsWith("https://www.instagram.com/p/")) {
    return NextResponse.json({ message: "Invalid Instagram image URL." }, { status: 400 });
    
  }

  try {
    // Fetch the image from the URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const image = "data:image/jpeg;base64," + Buffer.from(response.data, "binary").toString("base64");

    // Create a new PDF document
    const doc = new jsPDF();

    // Add the image to the PDF document
    doc.addImage(image, "JPEG", 15, 40, 180, 180);

    // Convert the PDF document into a byte array
    const pdfBytes = doc.output("arraybuffer");

    console.log(pdfBytes)

    // Send the PDF bytes in the response

    // @ts-ignore
    const res = NextResponse.from(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachmentfilename=instagram-image.pdf",
        }
      });
    console.log(res);
    return res

    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=instagram-image.pdf');
    // return NextResponse.json({
    //   nextRes,
    // });
  } catch (error: any) {
    NextResponse.json({ message: `An error occurred: ${error.message}` });
  }
//   return NextResponse.json({
//     nextRes,
//   });
}
