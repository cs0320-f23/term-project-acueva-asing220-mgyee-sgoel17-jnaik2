import { test, expect } from "@playwright/test";

test("signup success", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");

  const emailInput = await page.waitForSelector("#email", { timeout: 5000 });

  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  await emailInput.fill("test@example.com");
  await page.fill("#password", "test123");
  await page.getByRole("button").click();

  await page.goto("http://localhost:3000/how-to");
  expect(page.url()).toBe("http://localhost:3000/how-to");
});

test("signup with no inputs", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");

  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  await page.getByRole("button").click();

  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual("Invalid email address");

  await dialog.accept();
});

test("signup with existing email", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  await page.fill("#email", "test@gmail.com");
  await page.fill("#password", "test123");
  await page.getByRole("button").click();

  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual(
    "There is already an email with this account. Try logging in"
  );

  await dialog.accept();
});

test("signup with invalid email", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();

  await page.fill("#email", "a");
  await page.fill("#password", "Thisisastrongpassword");

  await page.getByRole("button").click();

  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual("Invalid email address");

  await dialog.accept();
});

test("signup with invalid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  await page.fill("#email", "invalidemail");
  await page.fill("#password", "short");

  await page.getByRole("button").click();

  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual("Invalid email address");

  await dialog.accept();
});

test("signup with weak password", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  await page.fill("#email", "sample@example.com");
  await page.fill("#password", "short");

  await page.getByRole("button").click();

  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual(
    "Please enter a stronger password. It should be minimum 6 characters"
  );

  await dialog.accept();
});

test("signup then login", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");

  const emailInput = await page.waitForSelector("#email", { timeout: 5000 });

  await emailInput.fill("test@example.com");
  await page.fill("#password", "test123");
  await page.click("text=Sign Up");

  await page.goto("http://localhost:3000/how-to");
  expect(page.url()).toBe("http://localhost:3000/how-to");

  await page.goto("http://localhost:3000/log-in");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  const emailInput2 = await page.waitForSelector("#email", { timeout: 5000 });
  await emailInput2.fill("test@example.com");
  await page.fill("#password", "test123");
  await page.getByRole("button").click();
  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual("Succesfully logged in");

  await dialog.accept();
});

test("login without signup", async ({ page }) => {
  await page.goto("http://localhost:3000/log-in");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  const emailInput2 = await page.waitForSelector("#email", { timeout: 5000 });
  await emailInput2.fill("test@example.com");
  await page.fill("#password", "test123");
  await page.getByRole("button").click();
  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual("Succesfully logged in");

  await dialog.accept();
});

test("signup then login with incorrect password", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");

  const emailInput = await page.waitForSelector("#email", { timeout: 5000 });

  await emailInput.fill("test@example.com");
  await page.fill("#password", "test123");
  await page.click("text=Sign Up");

  await page.goto("http://localhost:3000/how-to");
  expect(page.url()).toBe("http://localhost:3000/how-to");

  await page.goto("http://localhost:3000/log-in");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  const emailInput2 = await page.waitForSelector("#email", { timeout: 5000 });
  await emailInput2.fill("test@example.com");
  await page.fill("#password", "test1234");
  await page.getByRole("button").click();

  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual(
    "Incorrect email and/or password given. Please try again"
  );

  await dialog.accept();
});

test("signup then login with incorrect email", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");

  const emailInput = await page.waitForSelector("#email", { timeout: 5000 });

  await emailInput.fill("test@example.com");
  await page.fill("#password", "test123");
  await page.click("text=Sign Up");

  await page.goto("http://localhost:3000/how-to");
  expect(page.url()).toBe("http://localhost:3000/how-to");
  await page.goto("http://localhost:3000/log-in");
  const button = await page.getByRole("button");
  await expect(button).toBeVisible();
  const emailInput2 = await page.waitForSelector("#email", { timeout: 5000 });
  await emailInput2.fill("test2@example.com");
  await page.fill("#password", "test123");
  //   await page.click("text=Log in");
  await page.getByRole("button").click();

  const dialog = await page.waitForEvent("dialog");

  expect(dialog.type()).toContain("alert");

  expect(dialog.message()).toEqual(
    "Incorrect email and/or password given. Please try again"
  );

  await dialog.accept();
});

test("bypass sign up page", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");

  await page.click("text=Don't want to sign in? Continue to main page");

  expect(page.url()).toBe("http://localhost:3000/how-to");
});

test("go to login page from sign up", async ({ page }) => {
  await page.goto("http://localhost:3000/sign-up");

  await page.click("text=Already have an account? Sign in");

  expect(page.url()).toBe("http://localhost:3000/log-in");
});

test("go to signup page from login", async ({ page }) => {
  await page.goto("http://localhost:3000/log-in");

  await page.click("text=Don't have an account? Sign up here");

  expect(page.url()).toBe("http://localhost:3000/sign-up");
});

test("bypass login page", async ({ page }) => {
  await page.goto("http://localhost:3000/log-in");

  await page.click("text=Don't want to log in? Continue to main page");

  expect(page.url()).toBe("http://localhost:3000/how-to");
});

test("profile segments are hidden when user is not logged in", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/how-to");

  const profileDropdown = await page.$('[aria-label="Open user menu"]');
  expect(profileDropdown).toBeNull();

  const isProfileVisible = await page.isVisible('a[href="profile"]');
  const isSettingsVisible = await page.isVisible('a[href="settings"]');
  const isPastTeamsVisible = await page.isVisible('a[href="past-teams"]');
  const isSignOutVisible = await page.isVisible('a[href="#"]');

  expect(isProfileVisible).toBe(false);
  expect(isSettingsVisible).toBe(false);
  expect(isPastTeamsVisible).toBe(false);
  expect(isSignOutVisible).toBe(false);
});
