const categoryPath = {
    '/categories': {
        post: {
            tags: ['Category'],
            summary: 'add new category',
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
                                name: {
                                    type: 'string',
                                    description: 'category name',
                                }
                            },
                            required: ['name'],
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
                                    category: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            name: { type: 'string' },
                                            createdAt: { type: 'string' },
                                            updatedAt: { type: 'string' },
                                        },
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

        get: {
            tags: ['Category'],
            summary: 'get all categories',
            parameters: [
                {
                    in: 'query',
                    name: 'name',
                    required: false,
                    description: 'category name',
                    schema: {
                        type: 'string',
                    },
                },
                {
                    in: 'query',
                    name: 'limit',
                    required: false,
                    description: 'number of recorded fetched ber request "required of offset provided"',
                    schema: {
                        type: 'string',
                    },
                },
                {
                    in: 'query',
                    name: 'offset',
                    required: false,
                    description: 'number of recorded will skip "refer to page"',
                    schema: {
                        type: 'string',
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
                                    categories: {
                                        type: 'object',
                                        properties: {
                                            count: { type: 'number' },
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        name: { type: 'string' },
                                                        products: { type: 'integer' },
                                                        createdAt: { type: 'string' },
                                                        updatedAt: { type: 'string' },
                                                    }

                                                },
                                            },
                                        }
                                    }

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

    '/categories/{id}': {
        put: {
            tags: ['Category'],
            summary: 'update category',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'Category id',
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
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'category name',
                                }
                            },
                            required: ['name'],
                        },
                    },
                },
            },
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
                                    category: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            name: { type: 'string' },
                                            createdAt: { type: 'string' },
                                            updatedAt: { type: 'string' },
                                        },
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

        delete: {
            tags: ['Category'],
            summary: 'delete category',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'Category id',
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
                '403': {
                    description: 'Forbidden',
                },
                '500': {
                    description: 'Internal Server Error',
                }
            },
        },

    }
}

export default categoryPath