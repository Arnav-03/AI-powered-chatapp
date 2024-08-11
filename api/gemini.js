const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

async function generateContent() {
  const genAI = new GoogleGenerativeAI("AIzaSyAg02LfGa16I-vc7MvF3KVkgPwQRSCi_z8");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = "describe the image .write in hindi";

  try {
    const response = await axios.get("https://firebasestorage.googleapis.com/v0/b/fileshare-60268.appspot.com/o/Kashitokaru%2FIMG-20240810-WA0008.jpg?alt=media&token=8fc13492-0718-4da1-8fd1-a301937df6ae", {
      responseType: "arraybuffer"
    });

    const image = {
      inlineData: {
        data: Buffer.from(response.data).toString("base64"),
        mimeType: "image/png",
      },
    };

    const result = await model.generateContent([prompt, image]);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
generateContent();
