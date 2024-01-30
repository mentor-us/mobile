describe("SendMessagesuccess", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it.only("Should see Mentee group", async () => {
    await expect(element(by.text("TEST_MENTEE"))).toBeVisible();
  });
  it.only("Should see general chat channel in Test menter", async () => {
    await element(by.text("TEST_MENTEE")).tap();
    await expect(element(by.text("Cuộc trò chuyện chung"))).toBeVisible();
  });
  it.only("Should see chat box and submit btn", async () => {
    await element(by.text("Cuộc trò chuyện chung")).tap();
    await expect(element(by.id("chatbox"))).toBeVisible();
    await expect(element(by.id("btn-submit-chat"))).toBeVisible();
    await expect(element(by.id("back-button"))).toBeVisible();
  });
  it.only("Type message and check", async () => {
    await element(by.id("chatbox")).tap();
    await element(by.id("chatbox")).typeText("passcode");
    await element(by.id("btn-submit-chat")).tap();
    await element(by.id("back-button")).tap();
    await element(by.text("Cuộc trò chuyện chung")).tap();
    await expect(element(by.text("passcode"))).toBeVisible();
  });
});
