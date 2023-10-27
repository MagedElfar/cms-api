const rolePermissionPath = {
    '/role_permission': {
        post: {
            tags: ['Role_Permission'],
            summary: 'Assign new permission to specific role',
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
                                roleId: {
                                    type: 'integer',
                                    description: 'Role id',
                                },
                                permissionId: {
                                    type: 'integer',
                                    description: 'permission id',
                                }
                            },
                            required: ['roleId', 'permissionId'],
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
                                    rolePermission: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer' },
                                            roleId: { type: 'integer' },
                                            permissionId: { type: 'integer' },
                                            role: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    name: { type: 'string' },
                                                    createdAt: { type: 'string' },
                                                    updatedAt: { type: 'string' },
                                                },
                                            },
                                            permission: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer' },
                                                    name: { type: 'string' },
                                                    createdAt: { type: 'string' },
                                                    updatedAt: { type: 'string' },
                                                },
                                            }
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

        get: {
            tags: ['Role_Permission'],
            summary: 'get all roles',
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
                                    rolePermission: {
                                        type: "object",
                                        properties: {
                                            role: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'integer' },
                                                        name: { type: 'string' },
                                                        permissionId: { type: 'integer' },
                                                        roleId: { type: 'integer' },
                                                        createdAt: { type: 'string' },
                                                        updatedAt: { type: 'string' },
                                                        role: {
                                                            type: 'object',
                                                            properties: {
                                                                name: { type: 'string' },
                                                            }
                                                        },
                                                        permission: {
                                                            type: 'object',
                                                            properties: {
                                                                name: { type: 'string' },
                                                            }
                                                        }
                                                    }

                                                },
                                            }
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
    '/role_permission/{id}': {
        delete: {
            tags: ['Role_Permission'],
            summary: 'unassign permission from a specific role',
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'ID of assigned permission',
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

export default rolePermissionPath