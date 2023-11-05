var crypto = require("crypto");
describe("CreateChannelSuccessPage", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it.only("Should see Mentor group", async () => {
    await expect(element(by.text("TEST_MENTOR"))).toBeVisible();
  });
  it.only("Should see create channel button in Test mentor", async () => {
    await element(by.text("TEST_MENTOR")).tap();
    await expect(element(by.text("Tạo kênh mới"))).toBeVisible();
  });
  it.only("Should see name and description input and submit btn", async () => {
    await element(by.text("Tạo kênh mới")).tap();
    await expect(element(by.label("Tên kênh *"))).toBeVisible();
    // await expect(element(by.id("name-input"))).toBeVisible();
    await expect(element(by.label("Mô tả"))).toBeVisible();
    await expect(element(by.id("submit-btn"))).toBeVisible();
  });
  it.only("Fill form and submit", async () => {
    var name = await crypto.randomBytes(10).toString("hex");
    await expect(
      element(by.type("android.widget.EditText")).atIndex(0),
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(0).tap();
    await element(by.type("android.widget.EditText")).atIndex(0).typeText(name);

    await expect(
      element(by.type("android.widget.EditText")).atIndex(1),
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(1).tap();
    await element(by.type("android.widget.EditText")).atIndex(1).typeText(name);

    await element(by.id("submit-btn")).tap();
    await element(by.text(name)).tap();
    // await element(by.id("back-button")).tap();
    await expect(element(by.text(name))).toBeVisible();
  });
});
