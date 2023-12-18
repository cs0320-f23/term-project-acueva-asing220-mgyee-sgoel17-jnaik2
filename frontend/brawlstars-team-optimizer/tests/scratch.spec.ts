import { test, expect } from "@playwright/test";

test("table displays on page visit", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page.getByLabel("Submit button").click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole("columnheader", { name: "Team" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Score" })).toBeVisible();
});

test("table displays results for any mode or map", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page.getByLabel("Submit button").click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole("columnheader", { name: "Team" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Score" })).toBeVisible();
  await expect(page.getByLabel("teamCombo")).toHaveCount(10);
});

test("table displays results for a certain mode", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page.locator('[id="Mode\\ Select\\ Dropdown"]').click();
  await page.getByRole("option", { name: "Brawl Ball" }).click();
  await page.getByLabel("Submit button").click();
  await page.waitForTimeout(5000);
  await expect(page.getByRole("columnheader", { name: "Team" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Score" })).toBeVisible();
  await expect(page.getByLabel("teamCombo")).toHaveCount(10);
});

test("table displays results for a certain mode and map", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await page.locator('[id="Mode\\ Select\\ Dropdown"]').click();
  await page.getByRole("option", { name: "Brawl Ball" }).click();
  await page.locator('[id="Map\\ Select\\ Dropdown"]').click();
  await page.getByRole("option", { name: "Winter Party" }).click();
  await page.getByLabel("Submit button").click();
  await page.waitForTimeout(5000);
  await expect(page.getByLabel("teamCombo")).toHaveCount(10);
});

test("preferences?", async ({ page }) => {
  await page.goto("http://localhost:3000/3v3-optimizer");
  await expect(page.locator('[id="Mode\\ Select\\ Dropdown"]')).toBeVisible();
  await page.getByLabel("Input box for player 2 tag").click();
  await page.getByLabel("Input box for player 2 tag").fill("28OU2Q9J");
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(
      "If you enter a player ID, please enter them in this order: Player 1, Player 2, and Player 3"
    )
  ).toBeVisible();
});
