
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coba Cobi',
      version: '1.0.0',
      description: 'API documentation for Coba Cobi',
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
    },
    security: [
        {
          bearerAuth: [],
        }
    ],
    servers: [
      {
        url: 'http://localhost:3001', // sesuai base URL server
      },
    ],
  },
  apis: ['./routes/*.js'], // lokasi file dengan anotasi Swagger (pakai JSDoc-style)
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;
