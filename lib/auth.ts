export interface MockUser {
    id: number;
    name: string;
    email: string;
}

const mockUsers: MockUser[] = [
	{
		id: 1,
		name: "John Doe",
		email: "john.doe@example.com",
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane.smith@example.com",
	},
	{
		id: 3,
		name: "Donald McDuck",
		email: "donald@mcduck.com",
	},
];

export function getMockCurrentUser(): MockUser | null {
    const index = Math.floor(Date.now() / 10000) % mockUsers.length;
    return mockUsers[index] ?? null;
}
