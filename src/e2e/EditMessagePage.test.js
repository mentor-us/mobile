if(!crypto){
  var crypto = require('crypto')
}
var msg = crypto.randomBytes(10).toString("hex");

describe("EditMessagePage", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it.only("Should see Mentee group", async () => {
    await expect(element(by.text("TEST_MENTOR"))).toBeVisible();
  });
  it.only("Should see general chat channel in Test menter", async () => {
    await element(by.text("TEST_MENTOR")).tap();
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
    // await expect(element(by.text(msg))).toBeVisible();

    await element(by.id("btn-submit-chat")).tap();

    await element(by.id("back-button")).tap();
    await element(by.text("Cuộc trò chuyện chung")).tap();
    await expect(element(by.text(msg))).toBeVisible();

  });
  it.only("Edit message and check", async () => {
    await expect(element(by.text(msg))).toBeVisible();
    
    await element(by.text(msg)).longPress();
    await expect(element(by.id("copy-icon"))).toBeVisible();
    await element(by.id("edit-icon")).tap();
    await element(by.id("chatbox")).tap();
    var msgEdit = crypto.randomBytes(10).toString("hex");

    // await element(by.text(msg)).longPress();
    await element(by.id("chatbox")).typeText(msgEdit);
    await element(by.id("edit-submit-btn")).tap();
    await element(by.id("back-button")).tap();
    await element(by.text("Cuộc trò chuyện chung")).tap();
    await expect(element(by.text(msg+msgEdit))).toBeVisible();
    // await element(by.id("message-container")).tap();

    // await expect(await device.pasteboard()).toHaveString(msg);

  });
});