const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = function (req, res, next) {
  upload.single('image')(req, res, async function (err) {
    if (err) {
      console.error('Lỗi khi tải lên ảnh:', err);
      return res.status(400).json({ message: 'Lỗi khi tải lên ảnh' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Không có tệp ảnh nào được tải lên' });
    }
    const imageBuffer = req.file.buffer;

    try {
      const webpBuffer = await sharp(imageBuffer).webp().toBuffer();
      const originalFileName = req.file.originalname;
      const webpExtension = '.webp';
      const fileName = `${Date.now()}-${originalFileName.replace(/\.(jpg|jpeg|png|webp)$/i, ``)}${webpExtension}`;
      // upload image in filder upload
      fs.writeFileSync('uploads/' + fileName, webpBuffer);
      req.file.filename = fileName;
      next();
    } catch (err) {
      return res.status(500).json({ message: 'File Up load không đúng định dạng! (jpg|jpeg|png|webp)' });
    }
  });
};
