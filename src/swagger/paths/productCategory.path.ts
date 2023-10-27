const productCategoryPath = {
    '/product-categories': {
        post: {
            tags: ['Product_Category'],
            summary: 'Assign product to specific category',
            parameters: [
                {
                    name: 'Authorization',
                    in: 'header',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Bearer token',
                    example: 'Bearer eyJhbGciOiJIUzI1NiIsIn...',
                },

            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                productId: {
                                    type: 'integer',
                                    description: 'product id',
                                },
                                categoryId: {
                                    type: 'integer',
                                    description: 'category id',
                                }
                            },
                            required: ['categoryId', 'productId'],
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                // Response body schema definition here
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            productId: { type: 'integer' },
                                            categoryId: { type: 'integer' },
                                        }
                                    },
                                },
                            },
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                },
                '403': {
                    description: 'Forbidden',
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },

    },
    '/product-categories/{id}': {
        delete: {
            tags: ['Product_Category'],
            summary: 'unassign category from a specific product',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID of assigned category',
                    schema: {
                        type: 'integer',
                    },
                },
                {
                    name: 'Authorization',
                    in: 'header',
                    required: true,
                    schema: {
                        type: 'string',
                    },
                    description: 'Bearer token',
                    example: 'Bearer eyJhbGciOiJIUzI1NiIsIn...',
                },

            ],

            responses: {
                '200': {
                    description: 'Success',
                    content: {
                        'application/json': {
                            schema: {
                                // Response body schema definition here
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                },
                            },
                        }
                    }
                },
                '400': {
                    description: 'Bad Request',
                },
                '401': {
                    description: "Unauthorized"
                },
                '403': {
                    description: "Forbidden"
                },
                '404': {
                    description: "Not found"
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },
    }
}

export default productCategoryPath