const {readFileSync, writeFileSync} = require('fs')
const { Jimp } = require("jimp");

const text = readFileSync("./new.jpeg", {encoding: "base64"})

const newFile = writeFileSync("./image.txt", text)

const newImage = readFileSync("./image.txt", 'utf-8');
let buffer = Buffer.from(newImage, 'base64')
const n = writeFileSync('./image.jpeg', buffer)



const compress = async () => {
    try {
        const image = await Jimp.read("new.jpeg");

        // Resize the image
        image.resize(128,128);

        // Save the compressed image
        await image.writeAsync("./test-small.jpeg");
        console.log("Image compression successful!");
    } catch (error) {
        console.error("Error during image compression:", error);
    }
};

compress();