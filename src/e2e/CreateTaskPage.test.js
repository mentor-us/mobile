var crypto = require("crypto");
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
  it.only("Should see Mentor group", async () => {
    await expect(element(by.text("TEST_MENTOR"))).toBeVisible();
  });
  it.only("Should see create task button in Test mentor", async () => {
    await element(by.text("TEST_MENTOR")).tap();
  });
  it.only("Fill form and submit", async () => {
    var title = await crypto.randomBytes(10).toString("hex");
    var describe = await crypto.randomBytes(10).toString("hex");

    await expect(
      element(by.type("android.widget.EditText")).atIndex(0),
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(0).tap();
    await element(by.type("android.widget.EditText"))
      .atIndex(0)
      .typeText(title);

    await expect(
      element(by.type("android.widget.EditText")).atIndex(1),
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(1).tap();
    await element(by.type("android.widget.EditText"))
      .atIndex(1)
      .typeText(describe);
    await expect(
      element(by.type("android.widget.EditText")).atIndex(2),
    ).toBeVisible();
  });
});
