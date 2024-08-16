const express = require('express');
const multer = require('multer');
const CourseDetail = require('../models/CourseDetails.model');

const courseDetailsRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bufferToBase64 = (buffer) => buffer.toString('base64');

const parseJsonFields = (req, res, next) => {
  try {
    if (req.body.overviewPoints && typeof req.body.overviewPoints === 'string') {
      req.body.overviewPoints = JSON.parse(req.body.overviewPoints);
    }
    if (req.body.lessons && typeof req.body.lessons === 'string') {
      req.body.lessons = JSON.parse(req.body.lessons);
    }
    if (req.body.whoIsThisFor && typeof req.body.whoIsThisFor === 'string') {
      req.body.whoIsThisFor = JSON.parse(req.body.whoIsThisFor);
    }
    if (req.body.whatYouGet && typeof req.body.whatYouGet === 'string') {
      req.body.whatYouGet = JSON.parse(req.body.whatYouGet);
    }
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid JSON in request body', error: error.message });
  }
};

courseDetailsRouter.post('/add', upload.single('image'), parseJsonFields, async (req, res) => {
  try {
    const {
      title,
      description,
      overviewPoints,
      lessons,
      header,
      videoUrl,
      whoIsThisFor,
      whatYouGet,
      syllabus,
      price
    } = req.body;
    const image = req.file ? bufferToBase64(req.file.buffer) : '';

    const newCourse = new CourseDetail({
      title,
      description,
      overviewPoints,
      image,
      lessons,
      header,
      videoUrl,
      whoIsThisFor,
      whatYouGet,
      syllabus,
      price
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

courseDetailsRouter.get('/', async (req, res) => {
  try {
    const courses = await CourseDetail.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

courseDetailsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseDetail.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

courseDetailsRouter.put('/edit/:id', upload.single('image'), parseJsonFields, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      overviewPoints,
      lessons,
      header,
      videoUrl,
      whoIsThisFor,
      whatYouGet,
      syllabus,
      price
    } = req.body;
    const image = req.file ? bufferToBase64(req.file.buffer) : undefined;

    const updatedCourse = await CourseDetail.findByIdAndUpdate(
      id,
      {
        title,
        description,
        overviewPoints,
        ...(image && { image }),
        lessons,
        header,
        videoUrl,
        whoIsThisFor,
        whatYouGet,
        syllabus,
        price
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

courseDetailsRouter.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await CourseDetail.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = courseDetailsRouter;
