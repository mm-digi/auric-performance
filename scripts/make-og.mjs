import sharp from "sharp";

const logo = await sharp("public/images/logo-au3.png")
  .resize(280, 280, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const frame = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect x="48" y="48" width="1104" height="534" fill="none" stroke="#c9a84c" stroke-width="2"/></svg>`,
);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: { r: 14, g: 13, b: 12 },
  },
})
  .composite([
    { input: frame, top: 0, left: 0 },
    { input: logo, top: 175, left: 460 },
  ])
  .jpeg({ quality: 88 })
  .toFile("public/images/og.jpg");

console.log("wrote public/images/og.jpg");
