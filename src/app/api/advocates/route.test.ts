// import { GET } from './route';
// import { NextRequest } from 'next/server';
// import db from '@/db';
// import { Advocate } from '@/advocate';
// import { Response, Request, Headers } from 'node-fetch';

// global.Response = Response as unknown as typeof global.Response;
// global.Request = Request as unknown as typeof global.Request;
// global.Headers = Headers as unknown as typeof global.Headers;


// jest.mock('@/db', () => ({
//   select: jest.fn().mockReturnThis(),
//   from: jest.fn().mockReturnThis(),
//   where: jest.fn().mockReturnThis(),
//   limit: jest.fn().mockReturnThis(),
//   offset: jest.fn().mockReturnThis(),
// }));

// // Helper to create a mocked NextRequest
// function createMockNextRequest(url: string): NextRequest {
//   return {
//     url,
//     nextUrl: new URL(url),
//     method: 'GET',
//     headers: new Headers(),
//     body: null,
//     cookies: {} as any,
//     geo: {} as any,
//     ip: '127.0.0.1',
//     clone: () => createMockNextRequest(url),
//     arrayBuffer: async () => new ArrayBuffer(0),
//     blob: async () => new Blob(),
//     formData: async () => new FormData(),
//     json: async () => ({}),
//     text: async () => '',
//   } as unknown as NextRequest;
// }

// describe('GET /api/advocates', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return paginated advocates with default parameters', async () => {
//     const mockData: Advocate[] = [
//       {
//         id: 1,
//         firstName: 'John',
//         lastName: 'Doe',
//         city: 'New York',
//         degree: 'JD',
//         yearsOfExperience: 5,
//         specialties: ['Corporate Law'],
//         phoneNumber: 1234567890,
//         createdAt: null,
//       },
//     ];
//     const mockTotalCount = [{ count: 1 }];
//     (db.select as jest.Mock).mockResolvedValueOnce(mockData).mockResolvedValueOnce(mockTotalCount);

//     const req = createMockNextRequest('http://localhost/api/advocates');
//     const res = await GET(req);

//     expect(res.status).toBe(200);
//     const json = await res.json();
//     expect(json.data).toEqual(mockData);
//     expect(json.totalCount).toBe(1);
//     expect(db.select).toHaveBeenCalledTimes(2);
//   });

//   it('should apply search term and return filtered results', async () => {
//     const mockData: Advocate[] = [
//       {
//         id: 2,
//         firstName: 'Jane',
//         lastName: 'Smith',
//         city: 'Los Angeles',
//         degree: 'LLM',
//         yearsOfExperience: 10,
//         specialties: ['Family Law'],
//         phoneNumber: 1234567890,
//         createdAt: null,
//       },
//     ];
//     const mockTotalCount = [{ count: 1 }];
//     (db.select as jest.Mock).mockResolvedValueOnce(mockData).mockResolvedValueOnce(mockTotalCount);

//     const req = createMockNextRequest('http://localhost/api/advocates?searchTerm=Jane');
//     const res = await GET(req);

//     expect(res.status).toBe(200);
//     const json = await res.json();
//     expect(json.data).toEqual(mockData);
//     expect(json.totalCount).toBe(1);
//     expect(db.select).toHaveBeenCalledWith(expect.anything());
//   });

//   it('should handle invalid sort key gracefully', async () => {
//     const mockData: Advocate[] = [
//       {
//         id: 3,
//         firstName: 'Alice',
//         lastName: 'Johnson',
//         city: 'Chicago',
//         degree: 'JD',
//         yearsOfExperience: 7,
//         specialties: ['Criminal Law'],
//         phoneNumber: 1234567890,
//         createdAt: null,
//       },
//     ];
//     const mockTotalCount = [{ count: 1 }];
//     (db.select as jest.Mock).mockResolvedValueOnce(mockData).mockResolvedValueOnce(mockTotalCount);

//     const req = createMockNextRequest('http://localhost/api/advocates?sortKey=invalidKey');
//     const res = await GET(req);

//     expect(res.status).toBe(200);
//     const json = await res.json();
//     expect(json.data).toEqual(mockData);
//     expect(json.totalCount).toBe(1);
//     expect(db.select).toHaveBeenCalledWith(expect.anything());
//   });

//   it('should return 500 on database error', async () => {
//     (db.select as jest.Mock).mockRejectedValue(new Error('Database error'));

//     const req = createMockNextRequest('http://localhost/api/advocates');
//     const res = await GET(req);

//     expect(res.status).toBe(500);
//     const text = await res.text();
//     expect(text).toBe('Failed to fetch advocates');
//   });
// });
