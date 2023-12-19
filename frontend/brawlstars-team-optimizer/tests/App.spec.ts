import { test, expect } from "@playwright/test";

test("player id correct", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page.getByPlaceholder("Please Input Player 1's tag").click();
  await page.getByLabel("Input box for player 1 tag").click();
  await page.getByLabel("Input box for player 1 tag").fill("28OU2Q9J");
  await page.keyboard.press("Enter");
  await page.getByLabel("Preferred Brawlers for Player 1").click();
  await expect(page.getByRole("option", { name: "Pearl" })).toBeDisabled();
});

test("player id not valid", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await expect(
    page.getByPlaceholder("Please Input Player 1's Tag")
  ).toBeVisible();
  await page.getByLabel("Input box for player 1 tag").click();
  await page.getByLabel("Input box for player 1 tag").fill("abcd");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Player 1's ID is not valid. Please try again")
  ).toBeVisible();
});

test("player id wrong order", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await expect(
    page.getByPlaceholder("Please Input Player 2's Tag")
  ).toBeVisible();
  await page.getByLabel("Input box for player 2 tag").click();
  await page.getByLabel("Input box for player 2 tag").fill("28OU2Q9J");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      "If you enter a player ID, please enter them in this order: Player 1, Player 2, and Player 3"
    )
  ).toBeVisible();
});

// brawler card/table testing

test("brawler card table element present but empty on first load", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await expect(page.getByLabel("Brawler Card Table for Player 1")).toBeHidden();
  await expect(
    page.getByLabel("Brawler Card Table for Player 1")
  ).toBeDefined();
});

test("brawler card table expands for clicked brawlers", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await expect(
    page.getByLabel("Brawler Card Table for Player 1")
  ).toBeVisible();
  await expect(page.getByLabel("Player 1 Card for Shelly")).toBeVisible();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Colt" }).click();
  await page.getByLabel("Close").click();

  await expect(page.getByLabel("Player 1 Card for Colt")).toBeVisible();
});

test("brawler card table shrinks for unclicked brawlers", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Colt" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Colt" }).click();
  await page.getByLabel("Close").click();

  await expect(page.getByLabel("Player 1 Card for Colt")).toBeHidden();
  await expect(page.getByLabel("Player 1 Card for Shelly")).toBeHidden();

  //ensure that table is still there but empty
  await expect(page.getByLabel("Brawler Card Table for Player 1")).toBeHidden();
  await expect(
    page.getByLabel("Brawler Card Table for Player 1")
  ).toBeDefined();
});

test("brawler card table interactions", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Colt" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Spike" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Colt" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await expect(
    page.getByLabel("Brawler Card Table for Player 1")
  ).toBeVisible();
  await expect(page.getByLabel("Player 1 Card for Colt")).toBeHidden();
  await expect(page.getByLabel("Player 1 Card for Shelly")).toBeVisible();
  await expect(page.getByLabel("Player 1 Card for Spike")).toBeVisible();
});

//mode & map testing

test("mode works", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await expect(page.locator('[id="Mode Select Dropdown"]')).toBeVisible();
  await page.locator('[id="Mode Select Dropdown"]').click();
  await expect(page.getByRole("option", { name: "Brawl Ball" })).toBeVisible();
  await page.getByRole("option", { name: "Brawl Ball" }).click();
  await expect(page.locator('[id="Mode Select Dropdown"]')).toHaveText(
    "Brawl Ball"
  );
});

test("pref brawlers simple", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 2")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Colt" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 3")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Bull" }).click();
  await page.getByLabel("Close").click();
  await page.getByLabel("Submit button").click();

  await expect(page.getByLabel("teamCombo")).toHaveText("ShellyColtBull");
});

test("pref brawlers complicated", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Colt" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 2")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Lou" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 2")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Brock" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 3")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Bull" }).click();
  await page.getByLabel("Close").click();
  await page.getByLabel("Submit button").click();

  await page
    .getByLabel("Preferred Brawlers for Player 3")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Emz" }).click();
  await page.getByLabel("Close").click();
  await page.getByLabel("Submit button").click();

  await expect(page.getByLabel("teamCombo")).toHaveCount(8);
});

test("pref brawlers p1 only has 1", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page
    .getByLabel("Preferred Brawlers for Player 1")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Shelly" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 2")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Lou" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 2")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Brock" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 2")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Crow" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 2")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Spike" }).click();
  await page.getByLabel("Close").click();

  await page
    .getByLabel("Preferred Brawlers for Player 3")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Bull" }).click();
  await page.getByLabel("Close").click();
  await page.getByLabel("Submit button").click();

  await page
    .getByLabel("Preferred Brawlers for Player 3")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Emz" }).click();
  await page.getByLabel("Close").click();
  await page.getByLabel("Submit button").click();

  await page
    .getByLabel("Preferred Brawlers for Player 3")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Amber" }).click();
  await page.getByLabel("Close").click();
  await page.getByLabel("Submit button").click();

  await page
    .getByLabel("Preferred Brawlers for Player 3")
    .getByLabel("Open")
    .click();
  await page.getByRole("option", { name: "Janet" }).click();
  await page.getByLabel("Close").click();
  await page.getByLabel("Submit button").click();

  const teams = page.getByLabel("teamCombo");

  await expect(teams).toHaveCount(10);
  for (let i = 0; i < 10; i++) {
    await expect(teams.nth(i)).toHaveText(/Shelly.*/i);
  }
});
// test("", async ({ page }) => {
//   await page.goto("http://localhost:5173/");
//   await page.waitForTimeout(2000);
//   await page.mouse.click(0, 400);

//   await expect(await page.getByText("Enter keywords")).toBeVisible();
//   await expect(await page.getByText("Submit")).toBeVisible();
//   await expect(await page.getByText("Clear")).toBeVisible();
//   await expect(
//     await page.getByText("State: No state data found.")
//   ).toBeVisible();
//   await expect(await page.getByText("City: No city data found.")).toBeVisible();
//   await expect(await page.getByText("Name: No name data found.")).toBeVisible();
//   await expect(
//     await page.getByText("Broadband Access (%): No broadband data found.")
//   ).toBeVisible();
// });

// test("test consecutive invalid click, doesn't change display twice", async ({
//   page,
// }) => {
//   await page.goto("http://localhost:5173/");
//   await page.waitForTimeout(2000);
//   await page.mouse.click(0, 400);

//   await expect(await page.getByText("Enter keywords")).toBeVisible();
//   await expect(await page.getByText("Submit")).toBeVisible();
//   await expect(await page.getByText("Clear")).toBeVisible();
//   await expect(
//     await page.getByText("State: No state data found.")
//   ).toBeVisible();
//   await expect(await page.getByText("City: No city data found.")).toBeVisible();
//   await expect(await page.getByText("Name: No name data found.")).toBeVisible();
//   await expect(
//     await page.getByText("Broadband Access (%): No broadband data found.")
//   ).toBeVisible();

//   await page.waitForTimeout(2000);
//   await page.mouse.click(0, 400);

//   await expect(await page.getByText("Enter keywords")).toBeVisible();
//   await expect(await page.getByText("Submit")).toBeVisible();
//   await expect(await page.getByText("Clear")).toBeVisible();
//   await expect(
//     await page.getByText("State: No state data found.")
//   ).toBeVisible();
//   await expect(await page.getByText("City: No city data found.")).toBeVisible();
//   await expect(await page.getByText("Name: No name data found.")).toBeVisible();
//   await expect(
//     await page.getByText("Broadband Access (%): No broadband data found.")
//   ).toBeVisible();
// });

// test("test valid click after invalid click", async ({ page }) => {
//   await page.goto("http://localhost:5173/");
//   await page.waitForTimeout(2000);
//   await page.mouse.click(0, 400);
//   await expect(page.getByText("Enter keywords")).toBeVisible();
//   await expect(page.getByText("Submit")).toBeVisible();
//   await expect(page.getByText("Clear")).toBeVisible();
//   await expect(page.getByText("State: No state data found.")).toBeVisible();
//   await expect(page.getByText("City: No city data found.")).toBeVisible();
//   await expect(page.getByText("Name: No name data found.")).toBeVisible();
//   await expect(
//     page.getByText("Broadband Access (%): No broadband data found.")
//   ).toBeVisible();

//   await page.mouse.click(734, 217);
//   await page.waitForTimeout(2000);
//   await expect(page.getByText("Enter keywords")).toBeVisible();
//   await expect(page.getByText("Submit")).toBeVisible();
//   await expect(page.getByText("Clear")).toBeVisible();
//   await expect(page.getByText("State: RI")).toBeVisible();
//   await expect(page.getByText("City: Providence")).toBeVisible();
//   await expect(page.getByText("Name: No name data found.")).toBeVisible();
//   await expect(page.getByText("Broadband Access (%): 85.4")).toBeVisible();
// });
