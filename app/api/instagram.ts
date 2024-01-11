// Import necessary libraries
import { NextApiRequest, NextApiResponse } from 'next';
import { jsPDF } from 'jspdf';
import axios from 'axios';
// import { useToast } from "@/components/ui/use-toast";

// const { toast } = useToast();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
  // Extract the Instagram image URL from the request body
  const { imageUrl } = req.body;

  if (!imageUrl || !imageUrl.startsWith("https://www.instagram.com/p/")) {
    // toast({
    //     variant: "destructive",
    //     title: "Invalid Instagram image URL.",
    //     duration: 5000,
    //   });
    res.status(400).json({ message: 'Invalid Instagram image URL.' });
    return;
  }

  try {
    // Fetch the image from the URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const image = 'data:image/jpeg;base64,' + Buffer.from(response.data, 'binary').toString('base64');

    // Create a new PDF document
    const doc = new jsPDF();

    // Add the image to the PDF document
    doc.addImage(image, 'JPEG', 15, 40, 180, 180);

    // Convert the PDF document into a byte array
    const pdfBytes = doc.output('arraybuffer');

    // Send the PDF bytes in the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=instagram-image.pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error: any) {
    // If an error occurred, send a toast message with the error details
    // toast({
    //     variant: "destructive",
    //     title: `An error occurred: ${error.message}`,
    //     duration: 5000,
    //   });
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
}
