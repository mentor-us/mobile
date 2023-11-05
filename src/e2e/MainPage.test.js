describe("MainPage", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it.only("Should have noti icon in main page", async () => {
    await expect(element(by.id("noti_btn"))).toBeVisible();
    await element(by.id("noti_btn")).tap();
  });
});
