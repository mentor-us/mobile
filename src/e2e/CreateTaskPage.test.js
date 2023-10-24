describe("join mainpage", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it.only("Click canlendar icon", async () => {
    await expect(element(by.id("scheduleTab"))).toBeVisible();
    await element(by.id("scheduleTab")).tap();

    await expect(element(by.label("Floating Action Button"))).toBeVisible();
    await element(by.label("Floating Action Button")).tap();
    await expect(element(by.id("createTask"))).toBeVisible();
    await element(by.id("createTask")).tap();
  });

  // it.only("Click icon add button", async () => {
  //   await expect(element(by.label("Floating Action Button"))).toBeVisible();
  //   await element(by.label("Floating Action Button")).tap();
  //   await expect(element(by.id("createTask"))).toBeVisible();
  //   await element(by.id("createTask")).tap();
  // });
});
