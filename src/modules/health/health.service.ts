import { prisma } from "../../lib/prisma";

export default class HealthService {
	async isDatabaseUp(): Promise<boolean> {
		try {
			await prisma.$queryRaw`SELECT 1`;
			return true;
		} catch {
			return false;
		}
	}
}
