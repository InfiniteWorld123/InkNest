import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
	deleteNotificationService: vi.fn(),
	listNotificationsService: vi.fn(),
	markAllNotificationsReadService: vi.fn(),
	markNotificationReadService: vi.fn(),
}));

vi.mock("./notifications.service", () => serviceMocks);

import {
	deleteNotification,
	listNotifications,
	markAllNotificationsRead,
	markNotificationRead,
} from "./notifications.controller";

const user = { id: "user-1" };

describe("notifications controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists only the current user's notifications", async () => {
		serviceMocks.listNotificationsService.mockResolvedValue([]);

		const response = await listNotifications({ user });

		expect(serviceMocks.listNotificationsService).toHaveBeenCalledWith(user.id);
		expect(response.data).toEqual([]);
	});

	it("scopes a read update to the current user", async () => {
		serviceMocks.markNotificationReadService.mockResolvedValue({ id: 7 });

		await markNotificationRead({ user, params: { id: 7 } });

		expect(serviceMocks.markNotificationReadService).toHaveBeenCalledWith({
			userId: user.id,
			notificationId: 7,
		});
	});

	it("scopes the bulk read update to the current user", async () => {
		serviceMocks.markAllNotificationsReadService.mockResolvedValue([]);

		await markAllNotificationsRead({ user });

		expect(serviceMocks.markAllNotificationsReadService).toHaveBeenCalledWith(
			user.id,
		);
	});

	it("scopes deletion to the current user", async () => {
		serviceMocks.deleteNotificationService.mockResolvedValue({ id: 7 });

		await deleteNotification({ user, params: { id: 7 } });

		expect(serviceMocks.deleteNotificationService).toHaveBeenCalledWith({
			userId: user.id,
			notificationId: 7,
		});
	});
});
