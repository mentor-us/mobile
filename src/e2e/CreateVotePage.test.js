if(!crypto){
  var crypto = require('crypto')
}

describe("CreateVotePage", () => {
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
  it.only("Should have vote icon", async () => {
    await element(by.id('chatbox')).tap()
    await expect(element(by.id("vote-icon"))).toBeVisible();
    await element(by.id("vote-icon")).tap();
  });
  it.only('Screen should have question and 2 default option input and submit button ', async()=>{
    // await expect(element(by.id("title-header"))).toHaveText("Tạo bình chọn");
    await expect(element(by.text("Tạo bình chọn")).atIndex(0)).toBeVisible();
    await expect(element(by.label("Câu hỏi bình chọn *"))).toBeVisible();
    await expect(element(by.label("Lựa chọn 1"))).toBeVisible();
    await expect(element(by.label("Lựa chọn 2"))).toBeVisible();
    await expect(element(by.id("btn-create-vote"))).toBeVisible();


  });
  it.only('create schedule and validate', async()=>{
    var name = await crypto.randomBytes(10).toString("hex");
    await expect(
      element(by.type("android.widget.EditText")).atIndex(0)
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(0).tap();
    await element(by.type("android.widget.EditText")).atIndex(0).typeText(name);
    var option1 = crypto.randomBytes(5).toString("hex");
    var option2 = crypto.randomBytes(5).toString("hex");
    var indexFirstOption = 2;

    await expect(
      element(by.type("android.widget.EditText")).atIndex(indexFirstOption)
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(indexFirstOption).tap();
    await element(by.type("android.widget.EditText")).atIndex(indexFirstOption).typeText(option1);


    await expect(
      element(by.type("android.widget.EditText")).atIndex(indexFirstOption+1)
    ).toBeVisible();
    await element(by.type("android.widget.EditText")).atIndex(indexFirstOption+1).tap();
    await element(by.type("android.widget.EditText")).atIndex(indexFirstOption+1).typeText(option2);


    await element(by.id("btn-create-vote")).tap();
    // await element(by.text(name)).tap();
    // await element(by.id("back-button")).tap();
    await expect(element(by.text(name))).toBeVisible();
    await expect(element(by.text(option1))).toBeVisible();
    await expect(element(by.text(option2))).toBeVisible();
  });
});
