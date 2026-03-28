"use strict";
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechJob API',
      version: '1.0.0',
    },
  },

  // 🔥 อ่านจากไฟล์ TypeScript โดยตรง
  apis: [path.join(__dirname, '../src/routes/**/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;