import { connect, createVideoTable, end, testNow } from ".";

describe("db", () => {
  it("should connect and disconnect", async () => {
    await expect(connect()).resolves.toBe(undefined);
    await expect(end()).resolves.toBe(undefined);
  });

  it("should be able to get the time from the db", async () => {
    const data = await testNow();
    expect(data).toBeDefined();
  });

  it("shold create a table", async () => {
    await expect(createVideoTable()).resolves.not.toThrowError(undefined);
  });
});
