if(!crypto){
  var crypto = require('crypto')
}

describe("CreateSchedulePage", () => {
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
  it.only("Should have clock icon", async () => {
    await element(by.id('chatbox')).tap()
    await expect(element(by.id("clock-icon"))).toBeVisible();
    await element(by.id("clock-icon")).tap();
  });
  it.only('should have title input and submit button', async()=>{
    await expect(element(by.label("Tiêu đề  *"))).toBeVisible();
    await expect(element(by.label("Mô tả"))).toBeVisible();
    await expect(element(by.id("submit-btn"))).toBeVisible();


  });
  it.only('create schedule and validate', async()=>{
    var name = await crypto.randomBytes(10).toString("hex");
    await expect(
      element(by.type("android.widget.EditText")).atIndex(0),
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(0).tap();
    await element(by.type("android.widget.EditText")).atIndex(0).typeText(name);

    // await expect(
    //   element(by.type("android.widget.EditText")).atIndex(1),
    // ).toBeVisible();
    // await element(by.type("android.widget.EditText")).atIndex(1).tap();
    // await element(by.type("android.widget.EditText")).atIndex(1).typeText(name);


    await element(by.id("submit-btn")).tap();
    // await element(by.text(name)).tap();
    // await element(by.id("back-button")).tap();
    await expect(element(by.text(name))).toBeVisible();
  });
});
