if(!crypto){
  var crypto = require('crypto')
}
var msg = await crypto.randomBytes(10).toString("hex");

describe("CopyMessagesuccess", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

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
    await element(by.id("chatbox")).typeText(msg);
    await element(by.id("btn-submit-chat")).tap();
    await element(by.id("back-button")).tap();
    await element(by.text("Cuộc trò chuyện chung")).tap();
    await expect(element(by.text(msg))).toBeVisible();

  });
  it.only("Copy message and check pasteboard", async () => {
    await element(by.text(msg)).longPress();
    
    await expect(await device.pasteboard()).toHaveString(msg);

  });
});