/**
 * Model: User (ví dụ)
 */
export interface User {
    id: string | number
    fullname: string
    email: string
    phone: string
    role: 'admin' | 'user' | 'viewer'
    status: 'active' | 'inactive'
    joinedDate: string
    storageUsed: number
}

/**
 * Mock data cho User table
 */
export const mockUsers: User[] = [
    {
        id: 1,
        fullname: 'Nguyễn Văn A',
        email: 'nguyen.van.a@example.com',
        phone: '0901234567',
        role: 'admin',
        status: 'active',
        joinedDate: '2024-01-15',
        storageUsed: 5120, // MB
    },
    {
        id: 2,
        fullname: 'Trần Thị B',
        email: 'tran.thi.b@example.com',
        phone: '0912345678',
        role: 'user',
        status: 'active',
        joinedDate: '2024-02-20',
        storageUsed: 2048,
    },
    {
        id: 3,
        fullname: 'Lê Văn C',
        email: 'le.van.c@example.com',
        phone: '0923456789',
        role: 'user',
        status: 'inactive',
        joinedDate: '2024-03-10',
        storageUsed: 512,
    },
    {
        id: 4,
        fullname: 'Phạm Thị D',
        email: 'pham.thi.d@example.com',
        phone: '0934567890',
        role: 'viewer',
        status: 'active',
        joinedDate: '2024-04-05',
        storageUsed: 1024,
    },
    {
        id: 5,
        fullname: 'Vũ Văn E',
        email: 'vu.van.e@example.com',
        phone: '0945678901',
        role: 'user',
        status: 'active',
        joinedDate: '2024-05-12',
        storageUsed: 3072,
    },
]

/**
 * Model: Product (ví dụ khác)
 */
export interface Product {
    id: string | number
    name: string
    category: string
    price: number
    stock: number
    status: 'available' | 'discontinued'
    createdDate: string
}

/**
 * Mock data cho Product table
 */
export const mockProducts: Product[] = [
    {
        id: 'PROD001',
        name: 'Laptop Dell XPS 13',
        category: 'Điện tử',
        price: 25000000,
        stock: 15,
        status: 'available',
        createdDate: '2024-01-10',
    },
    {
        id: 'PROD002',
        name: 'Chuột Logitech MX Master',
        category: 'Phụ kiện',
        price: 1500000,
        stock: 42,
        status: 'available',
        createdDate: '2024-02-15',
    },
    {
        id: 'PROD003',
        name: 'Bàn phím Mechanical RGB',
        category: 'Phụ kiện',
        price: 2800000,
        stock: 0,
        status: 'discontinued',
        createdDate: '2024-03-20',
    },
    {
        id: 'PROD004',
        name: 'Monitor 4K 32 inch',
        category: 'Hiển thị',
        price: 8500000,
        stock: 8,
        status: 'available',
        createdDate: '2024-04-01',
    },
    {
        id: 'PROD005',
        name: 'Webcam Full HD',
        category: 'Phụ kiện',
        price: 890000,
        stock: 25,
        status: 'available',
        createdDate: '2024-05-05',
    },
]
