import { Tag } from 'swagger-jsdoc';

const tags: Tag[] = [
    {
        name: 'Authentication',
        description: 'API endpoints for user authentication',
        defaultCollapsed: false
    },
    {
        name: 'Role',
        description: 'API endpoints for add and mange roles in system',
        defaultCollapsed: false
    },
    {
        name: 'Permission',
        description: 'API endpoints for add and mange permissions in system',
        defaultCollapsed: true
    },
    {
        name: 'Role_Permission',
        description: 'API endpoints for assign persimmon to specific role',
        defaultCollapsed: true
    },
    {
        name: 'User',
        description: 'API endpoints for user',
        defaultCollapsed: true
    },
    {
        name: 'Category',
        description: 'API endpoints for Category',
        defaultCollapsed: true
    },
    {
        name: 'Product',
        description: 'API endpoints for product',
        defaultCollapsed: true
    },
    {
        name: 'Product_Category',
        description: 'API used for assign or unassign category to specific product',
        defaultCollapsed: true
    },

]

export default tags 